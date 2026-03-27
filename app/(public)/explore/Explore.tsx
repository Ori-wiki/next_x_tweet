import Link from 'next/link';
import { EmptyState } from '@/app/components/EmptyState';
import { ExploreSearchForm } from '@/app/components/ExploreSearchForm';
import { PageHero } from '@/app/components/PageHero';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { PAGES } from '@/app/config/pages.config';
import { getExploreData } from '@/app/shared/lib/tweets';
import type { SessionUser } from '@/app/shared/types/user.interface';

interface ExploreProps {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
  currentUser: SessionUser | null;
}

export const Explore = async ({ q, tag, sort, currentUser }: ExploreProps) => {
  const activeSort = sort === 'top' ? 'top' : 'latest';
  const { tweets, trends, matchedAuthors, matchedTags, suggestions } =
    await getExploreData({
      q,
      tag,
      sort: activeSort,
      currentUser,
    });

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
      <section className='space-y-5'>
        <PageHero
          eyebrow='Discover'
          title='Explore topics, hashtags and authors'
          description='Search by tweet content, author name or hashtag, then switch between latest and top results.'
          className='p-5'
        >
          <ExploreSearchForm
            q={q}
            tag={tag}
            sort={activeSort}
            suggestions={suggestions}
          />
          {(q || tag) && (
            <p className='mt-3 text-sm text-white/55'>
              Results: {tweets.length}
              {q ? `, query "${q}"` : ''}
              {tag ? `, tag #${tag.replace(/^#/, '')}` : ''}
              {`, sorted by ${activeSort}`}
            </p>
          )}
        </PageHero>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-white'>Authors</h2>
            <div className='mt-4 space-y-3'>
              {matchedAuthors.map((author) => (
                <Link
                  key={author.id}
                  href={PAGES.PROFILE(author.username)}
                  className='block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-sky-300/35 hover:bg-sky-400/8'
                >
                  <p className='font-medium text-white'>{author.name}</p>
                  <p className='text-sm text-sky-200'>@{author.username}</p>
                  <p className='mt-2 text-sm text-white/55'>
                    {author.topics.slice(0, 3).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-white'>Matching tags</h2>
            <div className='mt-4 flex flex-wrap gap-2'>
              {matchedTags.map(([hashtag, count]) => (
                <Link
                  key={hashtag}
                  href={`/explore?tag=${hashtag}&sort=${activeSort}`}
                  className='rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-sm text-sky-200 transition hover:border-sky-400/40 hover:bg-sky-400/15'
                >
                  #{hashtag} · {count}
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className='p-5 md:col-span-2 xl:col-span-1'>
            <h2 className='text-lg font-semibold text-white'>Tweets</h2>
            <p className='mt-3 text-sm text-white/55'>
              {tweets.length > 0
                ? 'Open the best matching conversations below.'
                : 'Try another query or jump into a trend from the sidebar.'}
            </p>
          </SurfaceCard>
        </div>

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

        <SurfaceCard className='p-5'>
          <h2 className='text-lg font-semibold text-white'>Search modes</h2>
          <div className='mt-4 space-y-3 text-sm text-white/60'>
            <p>`Latest` keeps the feed chronological.</p>
            <p>`Top` boosts tweets with likes, bookmarks, reposts and views.</p>
            <p>Suggestions and search history appear right in the form.</p>
          </div>
        </SurfaceCard>
      </aside>
    </div>
  );
};
