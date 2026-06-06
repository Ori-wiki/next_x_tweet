import type { TweetRecord } from '@/entities/tweet';
import type { UserRecord } from '@/entities/user';
import type { Dictionary } from '@/shared/lib/i18n';

export type NotificationFilter =
  | 'all'
  | 'replies'
  | 'reactions'
  | 'follows';

export type NotificationKind =
  | 'like'
  | 'repost'
  | 'bookmark'
  | 'reply'
  | 'follow';

export interface NotificationItem {
  id: string;
  actor: UserRecord;
  category: Exclude<NotificationFilter, 'all'>;
  kind: NotificationKind;
  label: string;
  content: string;
  createdAt: string;
  tweetId?: string;
}

type NotificationText = Dictionary['notifications'];

function findUser(users: UserRecord[], userId: string) {
  return users.find((user) => user.id === userId);
}

function createReactionItems(params: {
  users: UserRecord[];
  tweets: TweetRecord[];
  currentUserId: string;
  text: NotificationText;
}) {
  const { users, tweets, currentUserId, text } = params;
  const items: NotificationItem[] = [];
  const relations = [
    {
      ids: (tweet: TweetRecord) => tweet.likedBy,
      kind: 'like' as const,
      label: text.liked,
    },
    {
      ids: (tweet: TweetRecord) => tweet.repostedBy,
      kind: 'repost' as const,
      label: text.reposted,
    },
    {
      ids: (tweet: TweetRecord) => tweet.bookmarkedBy,
      kind: 'bookmark' as const,
      label: text.bookmarked,
    },
  ];

  tweets
    .filter((tweet) => tweet.authorId === currentUserId)
    .forEach((tweet) => {
      relations.forEach((relation) => {
        relation.ids(tweet).forEach((userId) => {
          const actor = findUser(users, userId);

          if (!actor || actor.id === tweet.authorId) {
            return;
          }

          items.push({
            id: `${tweet.id}-${relation.kind}-${actor.id}`,
            actor,
            category: 'reactions',
            kind: relation.kind,
            label: relation.label,
            content: tweet.content,
            createdAt: tweet.createdAt,
            tweetId: tweet.id,
          });
        });
      });
    });

  return items;
}

function createReplyItems(params: {
  users: UserRecord[];
  tweets: TweetRecord[];
  currentUserId: string;
  text: NotificationText;
}) {
  const { users, tweets, currentUserId, text } = params;
  const tweetsById = new Map(tweets.map((tweet) => [tweet.id, tweet]));

  return tweets.flatMap<NotificationItem>((tweet) => {
    if (!tweet.replyToId) {
      return [];
    }

    const parent = tweetsById.get(tweet.replyToId);
    const actor = findUser(users, tweet.authorId);

    if (
      !parent ||
      !actor ||
      actor.id === parent.authorId ||
      parent.authorId !== currentUserId
    ) {
      return [];
    }

    return [{
      id: `${tweet.id}-reply`,
      actor,
      category: 'replies',
      kind: 'reply',
      label: text.repliedTo,
      content: tweet.content,
      createdAt: tweet.createdAt,
      tweetId: tweet.id,
    }];
  });
}

function createFollowItems(users: UserRecord[], currentUserId: string) {
  return users.flatMap<NotificationItem>((actor) =>
    actor.followingIds.includes(currentUserId)
      ? [{
          id: `follow-${actor.id}`,
          actor,
          category: 'follows',
          kind: 'follow',
          label: 'started following you',
          content: `${actor.name} started following you.`,
          createdAt: new Date().toISOString(),
        }]
      : [],
  );
}

export function resolveNotificationFilter(
  value?: string,
): NotificationFilter {
  return value === 'replies' ||
    value === 'reactions' ||
    value === 'follows'
    ? value
    : 'all';
}

export function createNotifications(params: {
  users: UserRecord[];
  tweets: TweetRecord[];
  currentUserId: string;
  text: NotificationText;
  filter: NotificationFilter;
}) {
  const { users, tweets, currentUserId, text, filter } = params;

  return [
    ...createFollowItems(users, currentUserId),
    ...createReplyItems({ users, tweets, currentUserId, text }),
    ...createReactionItems({ users, tweets, currentUserId, text }),
  ]
    .filter((item) => filter === 'all' || item.category === filter)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .slice(0, 24);
}

export function groupNotifications(items: NotificationItem[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      key: 'today' as const,
      items: items.filter(
        (item) => now - new Date(item.createdAt).getTime() < day,
      ),
    },
    {
      key: 'thisWeek' as const,
      items: items.filter((item) => {
        const age = now - new Date(item.createdAt).getTime();
        return age >= day && age < 7 * day;
      }),
    },
    {
      key: 'earlier' as const,
      items: items.filter(
        (item) => now - new Date(item.createdAt).getTime() >= 7 * day,
      ),
    },
  ];
}
