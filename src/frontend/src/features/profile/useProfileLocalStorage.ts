import { useState, useEffect } from 'react';
import { ProfileData, DEFAULT_PROFILE } from './profileTypes';

const STORAGE_KEY = 'linktree_profile_v1';
const MIGRATION_KEY = 'linktree_snapchat_migration_v1';
const EMAIL_MIGRATION_KEY = 'linktree_email_migration_v1';
const SNAPCHAT_URL = 'https://www.snapchat.com/add/irfan_jujara1?share_id=C0cEQ9XkCtE&locale=en-US';

function migrateProfileWithSnapchat(profile: ProfileData): ProfileData {
  // Check if migration has already been done
  const migrationDone = localStorage.getItem(MIGRATION_KEY);
  if (migrationDone === 'true') {
    return profile;
  }

  // Check if Snapchat link already exists
  const hasSnapchat = profile.links.some(link => link.url === SNAPCHAT_URL);
  
  if (!hasSnapchat) {
    // Add Snapchat link
    const migratedProfile = {
      ...profile,
      links: [
        ...profile.links,
        { label: 'Add me on Snapchat', url: SNAPCHAT_URL }
      ]
    };
    
    // Mark migration as done
    localStorage.setItem(MIGRATION_KEY, 'true');
    
    return migratedProfile;
  }

  // Mark migration as done even if link already exists
  localStorage.setItem(MIGRATION_KEY, 'true');
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
        let loadedProfile = JSON.parse(stored) as ProfileData;
        loadedProfile = migrateProfileWithSnapchat(loadedProfile);
        loadedProfile = migrateProfileWithEmail(loadedProfile);
        loadedProfile = cleanupSocialLinks(loadedProfile);
        return loadedProfile;
      }
    } catch (error) {
      console.error('Failed to load profile from localStorage:', error);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error);
    }
  }, [profile]);

  const updateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
  };

  const updateLink = (index: number, label: string, url: string) => {
    setProfile((prev) => {
      const newLinks = [...prev.links];
      newLinks[index] = { label, url };
      return { ...prev, links: newLinks };
    });
  };

  const addLink = (label: string, url: string) => {
    setProfile((prev) => ({
      ...prev,
      links: [...prev.links, { label, url }]
    }));
  };

  const removeLink = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    setProfile((prev) => {
      const newLinks = [...prev.links];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newLinks.length) return prev;
      [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
      return { ...prev, links: newLinks };
    });
  };

  return {
    profile,
    updateProfile,
    updateLink,
    addLink,
    removeLink,
    moveLink
  };
}
