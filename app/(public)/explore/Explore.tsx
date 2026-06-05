import Link from 'next/link';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { ExploreSearchForm } from '@/src/widgets/navigation/ui/ExploreSearchForm';
import { PageHero } from '@/src/shared/ui/PageHero';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';
import { TweetList } from '@/src/entities/tweet/ui/TweetList';
import { PAGES } from '@/src/shared/config/pages';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { getExploreData } from '@/src/entities/tweet';
import type { SessionUser } from '@/src/entities/user/model/types';

interface ExploreProps {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
  currentUser: SessionUser | null;
}

export const Explore = async ({ q, tag, sort, currentUser }: ExploreProps) => {
  const language = resolveLanguage(currentUser?.settings);
  const { common, explore } = getDictionary(language);
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
          eyebrow={explore.eyebrow}
          title={explore.title}
          description={explore.description}
          className='p-5'
        >
          <ExploreSearchForm
            q={q}
            tag={tag}
            sort={activeSort}
            suggestions={suggestions}
            texts={{
              searchPlaceholder: explore.searchPlaceholder,
              tagPlaceholder: explore.tagPlaceholder,
              latestFirst: explore.latestFirst,
              topTweets: explore.topTweets,
              search: common.search,
            }}
          />
          {(q || tag) && (
            <p className='mt-3 text-sm text-[var(--color-text-soft)]'>
              {explore.results}: {tweets.length}
              {q ? `, ${explore.query} "${q}"` : ''}
              {tag ? `, ${explore.tag} #${tag.replace(/^#/, '')}` : ''}
              {`, ${explore.sortedBy} ${activeSort === 'top' ? explore.top : explore.latest}`}
            </p>
          )}
        </PageHero>

        <div className='grid gap-4 md:grid-cols-2'>
          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-[var(--color-text-primary)]'>{explore.authors}</h2>
            <div className='mt-4 space-y-3'>
              {matchedAuthors.map((author) => (
                <Link
                  key={author.id}
                  href={PAGES.PROFILE(author.username)}
                  className='block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-3 transition hover:border-[var(--color-accent-border-soft)] hover:bg-[var(--color-accent-surface)]'
                >
                  <p className='font-medium text-[var(--color-text-primary)]'>{author.name}</p>
                  <p className='text-sm text-[var(--color-accent-text)]'>@{author.username}</p>
                  <p className='mt-2 text-sm text-[var(--color-text-soft)]'>
                    {author.topics.slice(0, 3).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-[var(--color-text-primary)]'>
              {explore.matchingTags}
            </h2>
            <div className='mt-4 flex flex-wrap gap-2'>
              {matchedTags.map(([hashtag, count]) => (
                <Link
                  key={hashtag}
                  href={`/explore?tag=${hashtag}&sort=${activeSort}`}
                  className='rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] px-3 py-2 text-sm text-[var(--color-accent-text)] transition hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface-hover)]'
                >
                  #{hashtag} · {count}
                </Link>
              ))}
            </div>
          </SurfaceCard>
        </div>

        {tweets.length > 0 ? (
          <TweetList
            tweets={tweets}
            canInteract={Boolean(currentUser)}
            emptyMessage=''
            language={language}
          />
        ) : (
          <EmptyState message={explore.noMatches} />
        )}
      </section>

      <aside className='sidebar-scroll self-start lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'>
        <div className='space-y-4'>
        <SurfaceCard className='p-5'>
          <h2 className='text-lg font-semibold text-[var(--color-text-primary)]'>{explore.trendingNow}</h2>
          <div className='mt-4 space-y-3'>
            {trends.map(([hashtag, count]) => (
              <Link
                key={hashtag}
                href={`/explore?tag=${hashtag}`}
                className='block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-3 transition hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface)]'
              >
                <p className='font-medium text-[var(--color-accent-text)]'>#{hashtag}</p>
                <p className='text-sm text-[var(--color-text-soft)]'>
                  {count} {explore.tweetsCount}
                </p>
              </Link>
            ))}
          </div>
        </SurfaceCard>
        </div>
      </aside>
    </div>
  );
};
