export const PAGES = {
  HOME: '/',
  EXPLORE: '/explore',
  DASHBOARD: '/dashboard',
  BOOKMARKS: '/bookmarks',
  NOTIFICATIONS: '/notifications',
  TWEET: (tweetId: string) => `/tweet/${tweetId}`,
  PROFILE: (username: string) => `/u/${username}`,
};
