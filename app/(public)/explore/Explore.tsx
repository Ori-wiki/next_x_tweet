import Link from 'next/link';
import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { getExploreData } from '@/app/shared/lib/tweets';
import type { SessionUser } from '@/app/shared/types/user.interface';

interface ExploreProps {
  q?: string;
  tag?: string;
  currentUser: SessionUser | null;
}

export const Explore = async ({ q, tag, currentUser }: ExploreProps) => {
  const { tweets, trends } = await getExploreData({ q, tag, currentUser });

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <section className='space-y-5'>
        <PageHero
          eyebrow='Discover'
          title='Explore topics, hashtags and authors'
          description='Search by tweet content, author name or hashtag and jump into the current trends.'
          className='p-5'
        >
          <form className='mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'>
            <input
              name='q'
              defaultValue={q}
              placeholder='Search by text or author'
              className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
            />
            <input
              name='tag'
              defaultValue={tag}
              placeholder='Tag, for example nextjs'
              className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
            />
            <button
              type='submit'
              className='rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-sky-300'
            >
              Search
            </button>
          </form>
          {(q || tag) && (
            <p className='mt-3 text-sm text-white/55'>
              Results: {tweets.length}
              {q ? `, query "${q}"` : ''}
              {tag ? `, tag #${tag.replace(/^#/, '')}` : ''}
            </p>
          )}
        </PageHero>

        {tweets.length > 0 ? (
          <TweetList
            tweets={tweets}
            canInteract={Boolean(currentUser)}
            emptyMessage=''
          />
        ) : (
          <EmptyState message='No tweets matched your filters. Try a different query or jump into one of the trends.' />
        )}
      </section>

      <aside className='space-y-4'>
        <SurfaceCard className='p-5'>
          <h2 className='text-lg font-semibold text-white'>Trending now</h2>
          <div className='mt-4 space-y-3'>
            {trends.map(([hashtag, count]) => (
              <Link
                key={hashtag}
                href={`/explore?tag=${hashtag}`}
                className='block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-sky-300/40 hover:bg-sky-400/10'
              >
                <p className='font-medium text-sky-200'>#{hashtag}</p>
                <p className='text-sm text-white/50'>{count} tweets</p>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </aside>
    </div>
  );
};
