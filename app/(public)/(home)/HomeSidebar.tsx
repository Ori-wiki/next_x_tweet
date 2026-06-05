import Link from 'next/link';
import { TrendingUp, UserRound } from 'lucide-react';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';
import { PAGES } from '@/src/shared/config/pages';
import { readDemoDatabase } from '@/src/shared/lib/demo-db';
import type { SessionUser } from '@/src/entities/user/model/types';

interface HomeSidebarProps {
  currentUser: SessionUser | null;
}

function getTrends(tweets: Awaited<ReturnType<typeof readDemoDatabase>>['tweets']) {
  const counts = tweets.reduce<Map<string, number>>((accumulator, tweet) => {
    tweet.hashtags.forEach((hashtag) => {
      accumulator.set(hashtag, (accumulator.get(hashtag) ?? 0) + 1);
    });

    return accumulator;
  }, new Map());

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);
}

export const HomeSidebar = async ({ currentUser }: HomeSidebarProps) => {
  const database = await readDemoDatabase();
  const suggestedUsers = database.users
    .filter((user) => user.id !== currentUser?.id)
    .slice(0, 3);
  const trends = getTrends(database.tweets);

  return (
    <aside className='space-y-4'>
      <SurfaceCard className='p-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-sm font-semibold text-[var(--color-text-inverse)]'>
            {currentUser?.avatar ?? <UserRound aria-hidden='true' size={20} />}
          </div>
          <div className='min-w-0'>
            <p className='truncate font-semibold text-[var(--color-text-primary)]'>
              {currentUser?.name ?? 'Demo visitor'}
            </p>
            <p className='truncate text-sm text-[var(--color-text-secondary)]'>
              {currentUser ? `@${currentUser.username}` : 'Choose a demo role'}
            </p>
          </div>
        </div>
        <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='font-semibold text-[var(--color-text-primary)]'>
              {currentUser?.followers.toLocaleString('en-US') ?? '0'}
            </p>
            <p className='text-[var(--color-text-secondary)]'>Followers</p>
          </div>
          <div>
            <p className='font-semibold text-[var(--color-text-primary)]'>
              {currentUser?.following.toLocaleString('en-US') ?? '0'}
            </p>
            <p className='text-[var(--color-text-secondary)]'>Following</p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className='p-5'>
        <div className='mb-4 flex items-center gap-2 text-[var(--color-text-primary)]'>
          <TrendingUp aria-hidden='true' size={18} />
          <h2 className='font-semibold'>Trending</h2>
        </div>
        <div className='space-y-3'>
          {trends.map(([hashtag, count]) => (
            <Link
              key={hashtag}
              href={`/explore?tag=${hashtag}`}
              className='block rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]'
            >
              <p className='font-medium text-[var(--color-accent)]'>#{hashtag}</p>
              <p className='text-sm text-[var(--color-text-secondary)]'>
                {count} tweets
              </p>
            </Link>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className='p-5'>
        <h2 className='font-semibold text-[var(--color-text-primary)]'>
          Suggested profiles
        </h2>
        <div className='mt-4 space-y-3'>
          {suggestedUsers.map((user) => (
            <Link
              key={user.id}
              href={PAGES.PROFILE(user.username)}
              className='flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]'
            >
              <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-sm font-semibold text-[var(--color-text-inverse)]'>
                {user.avatar}
              </span>
              <span className='min-w-0'>
                <span className='block truncate font-medium text-[var(--color-text-primary)]'>
                  {user.name}
                </span>
                <span className='block truncate text-sm text-[var(--color-text-secondary)]'>
                  @{user.username}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </SurfaceCard>
    </aside>
  );
};
