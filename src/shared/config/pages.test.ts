import { describe, expect, it } from 'vitest';
import { PAGES } from './pages';

describe('page route builders', () => {
  it('builds encoded explore filters', () => {
    expect(
      PAGES.EXPLORE_WITH({
        q: 'design systems',
        tag: 'next js',
        sort: 'top',
      }),
    ).toBe('/explore?q=design+systems&tag=next+js&sort=top');
  });

  it('builds profile and notification filters', () => {
    expect(PAGES.PROFILE_TAB('jane', 'likes')).toBe('/u/jane?tab=likes');
    expect(PAGES.NOTIFICATIONS_FILTER('replies')).toBe(
      '/notifications?filter=replies',
    );
  });
});
