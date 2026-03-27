export const PROFILE_TABS = [
  { key: 'posts', label: 'Posts' },
  { key: 'likes', label: 'Likes' },
  { key: 'media', label: 'Media' },
] as const;

export type ProfileTabKey = (typeof PROFILE_TABS)[number]['key'];
