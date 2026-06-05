export const PAGES = {
  HOME: '/',
  EXPLORE: '/explore',
  DASHBOARD: '/dashboard',
  NOTIFICATIONS: '/notifications',
  TWEET: (tweetId: string) => `/tweet/${tweetId}`,
  PROFILE: (username: string) => `/u/${username}`,
};
