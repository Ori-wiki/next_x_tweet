import Link from 'next/link';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { PageHero } from '@/src/shared/ui/PageHero';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';
import { PAGES } from '@/src/shared/config/pages';
import { getSessionUser } from '@/src/entities/user/model/session';
import { readDemoDatabase } from '@/src/shared/lib/demo-db';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { formatRelativeDate } from '@/src/shared/lib/utils';
import type { TweetRecord } from '@/src/entities/tweet/model/types';
import type { UserRecord } from '@/src/entities/user/model/types';

type NotificationIcon = LucideIcon;

interface NotificationItem {
  id: string;
  Icon: NotificationIcon;
  actor: UserRecord;
  tweet: TweetRecord;
  label: string;
  createdAt: string;
}

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
        tweet: syntheticTweet,
        label: 'started following you',
        createdAt: syntheticTweet.createdAt,
      },
    ];
  });
}

export default async function NotificationsPage() {
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
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, 24);

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={notifications.eyebrow}
        title={notifications.title}
        description={notifications.description}
      />

      {items.length > 0 ? (
        <div className='space-y-3'>
          {items.map(({ Icon, actor, createdAt, id, label, tweet }) => {
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
