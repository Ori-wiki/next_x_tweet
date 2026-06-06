import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/shared/lib/i18n';
import type { TweetRecord } from '@/entities/tweet';
import type { UserRecord } from '@/entities/user';
import {
  createNotifications,
  groupNotifications,
  resolveNotificationFilter,
} from './notifications';

const users: UserRecord[] = [
  {
    id: 'owner',
    username: 'owner',
    name: 'Owner',
    bio: '',
    avatar: 'O',
    followers: 1,
    following: 0,
    followingIds: [],
    topics: [],
    settings: { language: 'en' },
  },
  {
    id: 'actor',
    username: 'actor',
    name: 'Actor',
    bio: '',
    avatar: 'A',
    followers: 0,
    following: 1,
    followingIds: ['owner'],
    topics: [],
    settings: { language: 'en' },
  },
];

const tweets: TweetRecord[] = [
  {
    id: 'tweet',
    authorId: 'owner',
    content: 'Original',
    createdAt: '2026-01-01T00:00:00.000Z',
    hashtags: [],
    likedBy: ['actor'],
    bookmarkedBy: [],
    repostedBy: [],
    views: 1,
    replyToId: null,
  },
  {
    id: 'reply',
    authorId: 'actor',
    content: 'Reply',
    createdAt: '2026-01-02T00:00:00.000Z',
    hashtags: [],
    likedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    views: 1,
    replyToId: 'tweet',
  },
];

describe('notifications model', () => {
  it('builds personal reactions, replies and follows', () => {
    const items = createNotifications({
      users,
      tweets,
      currentUserId: 'owner',
      text: getDictionary('en').notifications,
      filter: 'all',
    });

    expect(items.map((item) => item.kind)).toEqual(
      expect.arrayContaining(['follow', 'reply', 'like']),
    );
  });

  it('filters categories and resolves unknown filters', () => {
    const items = createNotifications({
      users,
      tweets,
      currentUserId: 'owner',
      text: getDictionary('en').notifications,
      filter: 'replies',
    });

    expect(items).toHaveLength(1);
    expect(items[0].kind).toBe('reply');
    expect(resolveNotificationFilter('unknown')).toBe('all');
    expect(groupNotifications(items).flatMap((group) => group.items)).toEqual(
      items,
    );
  });
});
