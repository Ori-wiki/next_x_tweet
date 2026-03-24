import Link from 'next/link';
import { PageHero } from '@/app/components/PageHero';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { PAGES } from '@/app/config/pages.config';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDashboardData } from '@/app/shared/lib/tweets';

export const ProfileFake = async () => {
  const currentUser = await getSessionUser();

  if (!currentUser) {
    return null;
  }

  const dashboard = await getDashboardData(currentUser);

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow='Private route'
        title='Your demo dashboard is protected by middleware'
        description='This page summarizes your account, bookmarks and quick actions. Signing out makes the route private again.'
        className='bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)]'
      >
        <div className='flex flex-wrap gap-3'>
          <Link
            href={PAGES.PROFILE(currentUser.username)}
            className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-100'
          >
            Open public profile
          </Link>
          <Link
            href={PAGES.EXPLORE}
            className='rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15'
          >
            Open explore
          </Link>
        </div>
      </PageHero>

      <section className='grid gap-4 md:grid-cols-3'>
        <SurfaceCard className='p-5'>
          <p className='text-sm text-white/50'>User</p>
          <p className='mt-1 text-xl font-semibold text-white'>{currentUser.name}</p>
          <p className='text-sky-200'>@{currentUser.username}</p>
        </SurfaceCard>
        <SurfaceCard className='p-5'>
          <p className='text-sm text-white/50'>Liked tweets</p>
          <p className='mt-1 text-3xl font-semibold text-white'>
            {dashboard.likedTweets.length}
          </p>
        </SurfaceCard>
        <SurfaceCard className='p-5'>
          <p className='text-sm text-white/50'>Bookmarks</p>
          <p className='mt-1 text-3xl font-semibold text-white'>
            {dashboard.bookmarkedTweets.length}
          </p>
        </SurfaceCard>
      </section>

      <TweetList
        title='Saved tweets'
        tweets={dashboard.bookmarkedTweets}
        canInteract
        emptyMessage='No bookmarks yet. Save a few tweets from the timeline to see them here.'
      />
    </div>
  );
};
