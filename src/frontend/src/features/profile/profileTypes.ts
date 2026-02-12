export interface ProfileLink {
  label: string;
  url: string;
}

export interface ProfileData {
  displayName: string;
  bio: string;
  phone: string;
  email: string;
  links: ProfileLink[];
}

export const DEFAULT_PROFILE: ProfileData = {
  displayName: 'Jujara Irfan shokat',
  bio: 'Welcome to my page! Connect with me through the links below.',
  phone: '9687626609',
  email: 'ae560919@gmail.com',
  links: [
    { label: 'Add me on Snapchat', url: 'https://www.snapchat.com/add/irfan_jujara1?share_id=C0cEQ9XkCtE&locale=en-US' },
    { label: 'Follow me on Instagram', url: 'https://www.instagram.com/ae560919?igsh=NHFmdnppNzU4OWVy' }
  ]
};
