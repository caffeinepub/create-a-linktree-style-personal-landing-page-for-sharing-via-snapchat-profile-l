import { useState, useEffect } from 'react';
import { ProfileData, DEFAULT_PROFILE } from './profileTypes';

const STORAGE_KEY = 'linktree_profile_v1';
const MIGRATION_KEY = 'linktree_snapchat_migration_v1';
const EMAIL_MIGRATION_KEY = 'linktree_email_migration_v1';
const BIO_MIGRATION_KEY = 'linktree_bio_migration_v1';
const SNAPCHAT_URL = 'https://www.snapchat.com/add/irfan_jujara1?share_id=C0cEQ9XkCtE&locale=en-US';
const OLD_DEFAULT_BIO = 'Welcome to my page! Connect with me through the links below.';

function migrateProfileWithSnapchat(profile: ProfileData): ProfileData {
  // Check if migration has already been done
  const migrationDone = localStorage.getItem(MIGRATION_KEY);
  
  // Check if Snapchat link already exists
  const snapchatIndex = profile.links.findIndex(link => link.url === SNAPCHAT_URL);
  
  if (snapchatIndex !== -1) {
    // Normalize existing Snapchat link label to "Snapchat"
    const updatedLinks = [...profile.links];
    if (updatedLinks[snapchatIndex].label !== 'Snapchat') {
      updatedLinks[snapchatIndex] = { ...updatedLinks[snapchatIndex], label: 'Snapchat' };
      return {
        ...profile,
        links: updatedLinks
      };
    }
    // Mark migration as done if label is already correct
    if (migrationDone !== 'true') {
      localStorage.setItem(MIGRATION_KEY, 'true');
    }
    return profile;
  }
  
  // If migration not done and Snapchat link doesn't exist, add it
  if (migrationDone !== 'true') {
    const migratedProfile = {
      ...profile,
      links: [
        ...profile.links,
        { label: 'Snapchat', url: SNAPCHAT_URL }
      ]
    };
    
    // Mark migration as done
    localStorage.setItem(MIGRATION_KEY, 'true');
    
    return migratedProfile;
  }

  return profile;
}

function migrateProfileWithEmail(profile: ProfileData): ProfileData {
  // Check if migration has already been done
  const migrationDone = localStorage.getItem(EMAIL_MIGRATION_KEY);
  if (migrationDone === 'true') {
    return profile;
  }

  // Only add email if it's missing (undefined)
  // Do not overwrite if email exists (including empty string)
  if (profile.email === undefined) {
    const migratedProfile = {
      ...profile,
      email: DEFAULT_PROFILE.email
    };
    
    // Mark migration as done
    localStorage.setItem(EMAIL_MIGRATION_KEY, 'true');
    
    return migratedProfile;
  }

  // Mark migration as done even if email already exists
  localStorage.setItem(EMAIL_MIGRATION_KEY, 'true');
  return profile;
}

function migrateBioIfDefault(profile: ProfileData): ProfileData {
  // Check if migration has already been done
  const migrationDone = localStorage.getItem(BIO_MIGRATION_KEY);
  if (migrationDone === 'true') {
    return profile;
  }

  // Only update bio if it exactly matches the old default
  if (profile.bio === OLD_DEFAULT_BIO) {
    const migratedProfile = {
      ...profile,
      bio: DEFAULT_PROFILE.bio
    };
    
    // Mark migration as done
    localStorage.setItem(BIO_MIGRATION_KEY, 'true');
    
    return migratedProfile;
  }

  // Mark migration as done even if bio doesn't match (user customized it)
  localStorage.setItem(BIO_MIGRATION_KEY, 'true');
  return profile;
}

function cleanupSocialLinks(profile: ProfileData): ProfileData {
  // Remove Twitter/X and Instagram links from profile (Instagram has dedicated button)
  const filteredLinks = profile.links.filter(link => {
    const label = link.label.toLowerCase();
    const url = link.url.toLowerCase();
    
    // Filter out Twitter/X
    if (label.includes('twitter') || url.includes('twitter.com') || url.includes('x.com')) {
      return false;
    }
    
    // Filter out Instagram (we have a dedicated button for it)
    if (label.includes('instagram') || url.includes('instagram.com')) {
      return false;
    }
    
    return true;
  });

  return {
    ...profile,
    links: filteredLinks
  };
}

export function useProfileLocalStorage() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let loadedProfile = JSON.parse(stored);
        
        // Run migrations
        loadedProfile = migrateProfileWithSnapchat(loadedProfile);
        loadedProfile = migrateProfileWithEmail(loadedProfile);
        loadedProfile = migrateBioIfDefault(loadedProfile);
        loadedProfile = cleanupSocialLinks(loadedProfile);
        
        // Save migrated profile back to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedProfile));
        
        return loadedProfile;
      }
      return DEFAULT_PROFILE;
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  }, [profile]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addLink = (label: string, url: string) => {
    setProfile(prev => ({
      ...prev,
      links: [...prev.links, { label, url }]
    }));
  };

  const removeLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index: number, label: string, url: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { label, url } : link
      )
    }));
  };

  return {
    profile,
    updateProfile,
    addLink,
    removeLink,
    updateLink
  };
}
