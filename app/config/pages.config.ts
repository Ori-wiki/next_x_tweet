export const PAGES = {
  HOME: '/',
  EXPLORE: '/explore',
  PROFILE_FAKE: '/profile-fake',
  SHOP: '/shop',
  SSG: '/shop/ssg',
  ISR: '/shop/isr',
  PROFILE: (username: string) => `/u/${username}`,
};
