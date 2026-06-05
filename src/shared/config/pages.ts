export const PAGES = {
  HOME: '/',
  EXPLORE: '/explore',
  PROFILE_FAKE: '/profile-fake',
  NOTIFICATIONS: '/notifications',
  TWEET: (tweetId: string) => `/tweet/${tweetId}`,
  PROFILE: (username: string) => `/u/${username}`,
};
