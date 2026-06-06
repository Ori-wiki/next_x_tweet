import Link from 'next/link';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
} from 'lucide-react';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHero } from '@/shared/ui/PageHero';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { PAGES } from '@/shared/config/pages';
import { getSessionUser } from '@/entities/user';
import { readDemoDatabase } from '@/shared/db';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { formatDateTime } from '@/shared/lib/utils';
import {
  createNotifications,
  groupNotifications,
  resolveNotificationFilter,
  type NotificationFilter,
  type NotificationKind,
} from '../model/notifications';

const notificationIcons = {
  like: Heart,
  repost: Repeat2,
  bookmark: Bookmark,
  reply: MessageCircle,
  follow: UserPlus,
} satisfies Record<NotificationKind, typeof Heart>;

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = resolveNotificationFilter(params.filter);
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
  const items = createNotifications({
    users: database.users,
    tweets: database.tweets,
    currentUserId: currentUser.id,
    text: notifications,
    filter: activeFilter,
  });
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
              href={
                filter.key === 'all'
                  ? PAGES.NOTIFICATIONS
                  : PAGES.NOTIFICATIONS_FILTER(filter.key)
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-(--color-accent) bg-(--color-accent) text-(--color-background)'
                  : 'border-(--color-border) text-(--color-text-secondary) hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface) hover:text-(--color-text-primary)'
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
                <h2 className='text-sm font-semibold uppercase tracking-[0.16em] text-(--color-text-subtle)'>
                  {notifications[group.key]}
                </h2>
                {group.items.map((item) => {
                  const Icon = notificationIcons[item.kind];

                  return (
                    <SurfaceCard key={item.id} className='p-5'>
                      <div className='flex gap-4'>
                        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--color-accent-border) bg-(--color-accent-surface) text-(--color-accent)'>
                          <Icon aria-hidden='true' size={20} />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                            <Link
                              href={PAGES.PROFILE(item.actor.username)}
                              className='font-semibold text-(--color-text-primary) transition hover:text-(--color-accent)'
                            >
                              {item.actor.name}
                            </Link>
                            <span className='text-(--color-text-secondary)'>
                              {item.label}
                            </span>
                            <span className='text-sm text-(--color-text-subtle)'>
                              {formatDateTime(item.createdAt, language)}
                            </span>
                          </div>
                          <p className='mt-2 line-clamp-2 text-sm text-(--color-text-secondary)'>
                            {item.content}
                          </p>
                          {item.tweetId ? (
                            <Link
                              href={PAGES.TWEET(item.tweetId)}
                              className='mt-3 inline-flex rounded-full border border-(--color-border) px-3 py-1 text-sm font-medium text-(--color-accent) transition hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface)'
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
