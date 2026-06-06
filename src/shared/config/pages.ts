interface ExploreRouteParams {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
}

function withSearchParams<T extends object>(
  pathname: string,
  params: T,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export const PAGES = {
  HOME: '/',
  EXPLORE: '/explore',
  EXPLORE_WITH: (params: ExploreRouteParams) =>
    withSearchParams('/explore', params),
  DASHBOARD: '/dashboard',
  BOOKMARKS: '/bookmarks',
  NOTIFICATIONS: '/notifications',
  NOTIFICATIONS_FILTER: (filter: string) =>
    withSearchParams('/notifications', { filter }),
  TWEET: (tweetId: string) => `/tweet/${tweetId}`,
  PROFILE: (username: string) => `/u/${username}`,
  PROFILE_TAB: (username: string, tab: string) =>
    withSearchParams(`/u/${username}`, { tab }),
};
