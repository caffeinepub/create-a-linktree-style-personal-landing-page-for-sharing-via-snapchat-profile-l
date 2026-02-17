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
  bio: 'Creative professional & digital enthusiast. Let\'s connect!',
  phone: '9687626609',
  email: 'ae560919@gmail.com',
  links: [
    { label: 'Snapchat', url: 'https://www.snapchat.com/add/irfan_jujara1?share_id=C0cEQ9XkCtE&locale=en-US' }
  ]
};
