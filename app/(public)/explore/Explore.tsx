import Link from 'next/link';
import { Tweet } from '../(home)/Tweet';
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
        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-5'>
          <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
            Discover
          </p>
          <h1 className='mt-2 text-2xl font-bold text-white sm:text-3xl'>
            Explore topics, hashtags and authors
          </h1>
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
        </div>

        {tweets.length > 0 ? (
          <div className='space-y-5'>
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.id}
                tweet={tweet}
                canInteract={Boolean(currentUser)}
              />
            ))}
          </div>
        ) : (
          <div className='rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-white/70'>
            Ничего не найдено. Попробуй другой текст, убери фильтр или перейди по
            одному из трендов справа.
          </div>
        )}
      </section>

      <aside className='space-y-4'>
        <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-5'>
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
        </div>
      </aside>
    </div>
  );
};
