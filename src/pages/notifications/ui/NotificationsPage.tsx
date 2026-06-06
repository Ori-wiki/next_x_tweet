import Link from 'next/link';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHero } from '@/shared/ui/PageHero';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { PAGES } from '@/shared/config/pages';
import { getSessionUser } from '@/entities/user';
import { readDemoDatabase } from '@/shared/db';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { formatRelativeDate } from '@/shared/lib/utils';
import type { TweetRecord } from '@/entities/tweet';
import type { UserRecord } from '@/entities/user';

type NotificationIcon = LucideIcon;

interface NotificationItem {
  id: string;
  Icon: NotificationIcon;
  actor: UserRecord;
  category: NotificationFilter;
  tweet: TweetRecord;
  label: string;
  createdAt: string;
}

type NotificationFilter = 'all' | 'replies' | 'reactions' | 'follows';

function getUserOrNull(users: UserRecord[], userId: string) {
  return users.find((user) => user.id === userId) ?? null;
}

function createReactionItems(params: {
  users: UserRecord[];
  tweets: TweetRecord[];
  currentUserId?: string;
  text: ReturnType<typeof getDictionary>['notifications'];
}) {
  const { users, tweets, currentUserId, text } = params;
  const items: NotificationItem[] = [];

  tweets.forEach((tweet) => {
    const isPersonal = currentUserId && tweet.authorId === currentUserId;

    tweet.likedBy.forEach((userId) => {
      const actor = getUserOrNull(users, userId);
      if (!actor || actor.id === tweet.authorId) return;
      if (!isPersonal && currentUserId) return;

      items.push({
        id: `${tweet.id}-like-${actor.id}`,
        Icon: Heart,
        actor,
        category: 'reactions',
        tweet,
        label: isPersonal ? text.liked : text.globalLike,
        createdAt: tweet.createdAt,
      });
    });

    tweet.repostedBy.forEach((userId) => {
      const actor = getUserOrNull(users, userId);
      if (!actor || actor.id === tweet.authorId) return;
      if (!isPersonal && currentUserId) return;

      items.push({
        id: `${tweet.id}-repost-${actor.id}`,
        Icon: Repeat2,
        actor,
        category: 'reactions',
        tweet,
        label: isPersonal ? text.reposted : text.globalRepost,
        createdAt: tweet.createdAt,
      });
    });

    tweet.bookmarkedBy.forEach((userId) => {
      const actor = getUserOrNull(users, userId);
      if (!actor || actor.id === tweet.authorId) return;
      if (!isPersonal && currentUserId) return;

      items.push({
        id: `${tweet.id}-bookmark-${actor.id}`,
        Icon: Bookmark,
        actor,
        category: 'reactions',
        tweet,
        label: isPersonal ? text.bookmarked : text.globalBookmark,
        createdAt: tweet.createdAt,
      });
    });
  });

  return items;
}

function createReplyItems(params: {
  users: UserRecord[];
  tweets: TweetRecord[];
  currentUserId?: string;
  text: ReturnType<typeof getDictionary>['notifications'];
}) {
  const { users, tweets, currentUserId, text } = params;
  const tweetsById = new Map(tweets.map((tweet) => [tweet.id, tweet]));

  return tweets.flatMap<NotificationItem>((tweet) => {
    if (!tweet.replyToId) return [];
    const parent = tweetsById.get(tweet.replyToId);
    const actor = getUserOrNull(users, tweet.authorId);

    if (!parent || !actor || actor.id === parent.authorId) return [];
    if (currentUserId && parent.authorId !== currentUserId) return [];

    return [
      {
        id: `${tweet.id}-reply`,
        Icon: MessageCircle,
        actor,
        category: 'replies',
        tweet,
        label: currentUserId ? text.repliedTo : text.globalReply,
        createdAt: tweet.createdAt,
      },
    ];
  });
}

function createFollowItems(params: {
  users: UserRecord[];
  currentUserId?: string;
}) {
  const { users, currentUserId } = params;

  if (!currentUserId) return [];

  return users.flatMap<NotificationItem>((actor) => {
    if (!actor.followingIds.includes(currentUserId)) return [];
    const syntheticTweet = {
      id: `follow-${actor.id}`,
      authorId: actor.id,
      content: `${actor.name} started following you.`,
      createdAt: new Date().toISOString(),
      hashtags: [],
      likedBy: [],
      bookmarkedBy: [],
      repostedBy: [],
      views: 0,
      replyToId: null,
    } satisfies TweetRecord;

    return [
      {
        id: `follow-${actor.id}`,
        Icon: UserPlus,
        actor,
        category: 'follows',
        tweet: syntheticTweet,
        label: 'started following you',
        createdAt: syntheticTweet.createdAt,
      },
    ];
  });
}

function resolveFilter(value?: string): NotificationFilter {
  return value === 'replies' || value === 'reactions' || value === 'follows'
    ? value
    : 'all';
}

function groupNotifications(items: NotificationItem[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      key: 'today',
      items: items.filter((item) => now - new Date(item.createdAt).getTime() < day),
    },
    {
      key: 'thisWeek',
      items: items.filter((item) => {
        const age = now - new Date(item.createdAt).getTime();
        return age >= day && age < 7 * day;
      }),
    },
    {
      key: 'earlier',
      items: items.filter((item) => now - new Date(item.createdAt).getTime() >= 7 * day),
    },
  ] as const;
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = resolveFilter(params.filter);
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { notifications } = getDictionary(language);

  if (!currentUser) {
    return (
      <div className='space-y-5'>
        <PageHero
          eyebrow={notifications.eyebrow}
          title={notifications.title}
          description={notifications.signedOut}
        />

        <EmptyState
          message={notifications.signedOut}
          actionHref={PAGES.HOME}
          actionLabel='Go to home'
        />
      </div>
    );
  }

  const database = await readDemoDatabase();
  const currentUserId = currentUser.id;
  const items = [
    ...createFollowItems({ users: database.users, currentUserId }),
    ...createReplyItems({
      users: database.users,
      tweets: database.tweets,
      currentUserId,
      text: notifications,
    }),
    ...createReactionItems({
      users: database.users,
      tweets: database.tweets,
      currentUserId,
      text: notifications,
    }),
  ]
    .filter((item) => activeFilter === 'all' || item.category === activeFilter)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, 24);
  const groups = groupNotifications(items);
  const filters: Array<{ key: NotificationFilter; label: string }> = [
    { key: 'all', label: notifications.all },
    { key: 'replies', label: notifications.replies },
    { key: 'reactions', label: notifications.reactions },
    { key: 'follows', label: notifications.follows },
  ];

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={notifications.eyebrow}
        title={notifications.title}
        description={notifications.description}
      />

      <nav className='flex flex-wrap gap-2'>
        {filters.map((filter) => {
          const isActive = filter.key === activeFilter;

          return (
            <Link
              key={filter.key}
              href={filter.key === 'all' ? PAGES.NOTIFICATIONS : `${PAGES.NOTIFICATIONS}?filter=${filter.key}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-background)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {items.length > 0 ? (
        <div className='space-y-6'>
          {groups.map((group) =>
            group.items.length > 0 ? (
              <section key={group.key} className='space-y-3'>
                <h2 className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]'>
                  {notifications[group.key]}
                </h2>
                {group.items.map(({ Icon, actor, createdAt, id, label, tweet }) => {
                  const isFollow = id.startsWith('follow-');

                  return (
                    <SurfaceCard key={id} className='p-5'>
                      <div className='flex gap-4'>
                        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] text-[var(--color-accent)]'>
                          <Icon aria-hidden='true' size={20} />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                            <Link
                              href={PAGES.PROFILE(actor.username)}
                              className='font-semibold text-[var(--color-text-primary)] transition hover:text-[var(--color-accent)]'
                            >
                              {actor.name}
                            </Link>
                            <span className='text-[var(--color-text-secondary)]'>
                              {label}
                            </span>
                            <span className='text-sm text-[var(--color-text-subtle)]'>
                              {formatRelativeDate(createdAt)}
                            </span>
                          </div>
                          <p className='mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]'>
                            {tweet.content}
                          </p>
                          {!isFollow ? (
                            <Link
                              href={PAGES.TWEET(tweet.id)}
                              className='mt-3 inline-flex rounded-full border border-[var(--color-border)] px-3 py-1 text-sm font-medium text-[var(--color-accent)] transition hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface)]'
                            >
                              {notifications.openTweet}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </SurfaceCard>
                  );
                })}
              </section>
            ) : null,
          )}
        </div>
      ) : (
        <EmptyState
          message={notifications.noNotifications}
          actionHref={PAGES.HOME}
          actionLabel='Go to home'
        />
      )}
    </div>
  );
}
