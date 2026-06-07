import Link from 'next/link';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ExploreSearchForm } from '@/features/explore-search';
import { PageHero } from '@/shared/ui/PageHero';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { TweetList } from '@/widgets/tweet-feed';
import { PAGES } from '@/shared/config/pages';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { getExploreData } from '@/entities/tweet';
import type { SessionUser } from '@/entities/user';

export interface ExplorePageViewProps {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
  currentUser: SessionUser | null;
}

export default async function ExplorePageView({
  q,
  tag,
  sort,
  currentUser,
}: ExplorePageViewProps) {
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
            <p className='mt-3 text-sm text-(--color-text-soft)'>
              {explore.results}: {tweets.length}
              {q ? `, ${explore.query} "${q}"` : ''}
              {tag ? `, ${explore.tag} #${tag.replace(/^#/, '')}` : ''}
              {`, ${explore.sortedBy} ${activeSort === 'top' ? explore.top : explore.latest}`}
            </p>
          )}
        </PageHero>

        <div className='grid gap-4 md:grid-cols-2'>
          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-(--color-text-primary)'>{explore.authors}</h2>
            <div className='mt-4 space-y-3'>
              {matchedAuthors.map((author) => (
                <Link
                  key={author.id}
                  href={PAGES.PROFILE(author.username)}
                  className='block rounded-2xl border border-(--color-border) bg-(--color-surface-dark) px-4 py-3 transition hover:border-(--color-accent-border-soft) hover:bg-(--color-accent-surface)'
                >
                  <p className='font-medium text-(--color-text-primary)'>{author.name}</p>
                  <p className='text-sm text-(--color-accent-text)'>@{author.username}</p>
                  <p className='mt-2 text-sm text-(--color-text-soft)'>
                    {author.topics.slice(0, 3).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-(--color-text-primary)'>
              {explore.matchingTags}
            </h2>
            <div className='mt-4 flex flex-wrap gap-2'>
              {matchedTags.map(([hashtag, count]) => (
                <Link
                  key={hashtag}
                  href={PAGES.EXPLORE_WITH({
                    tag: hashtag,
                    sort: activeSort,
                  })}
                  className='rounded-full border border-(--color-accent-border) bg-(--color-accent-surface) px-3 py-2 text-sm text-(--color-accent-text) transition hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface-hover)'
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

      <aside className='sidebar-scroll hidden self-start lg:sticky lg:top-8 lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto'>
        <div className='space-y-4'>
        <SurfaceCard className='p-5'>
          <h2 className='text-lg font-semibold text-(--color-text-primary)'>{explore.trendingNow}</h2>
          <div className='mt-4 space-y-3'>
            {trends.map(([hashtag, count]) => (
              <Link
                key={hashtag}
                href={PAGES.EXPLORE_WITH({ tag: hashtag })}
                className='block rounded-2xl border border-(--color-border) bg-(--color-surface-dark) px-4 py-3 transition hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface)'
              >
                <p className='font-medium text-(--color-accent-text)'>#{hashtag}</p>
                <p className='text-sm text-(--color-text-soft)'>
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
}
