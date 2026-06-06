import { EmptyState } from '@/shared/ui/EmptyState';
import { LinkButton } from '@/shared/ui/LinkButton';
import { PageHero } from '@/shared/ui/PageHero';
import { TweetList } from '@/widgets/tweet-feed';
import { PAGES } from '@/shared/config/pages';
import { getSessionUser } from '@/entities/user';
import { getDashboardData } from '@/entities/tweet';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';

export default async function BookmarksPage() {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { bookmarks } = getDictionary(language);

  if (!currentUser) {
    return (
      <div className='space-y-5'>
        <PageHero
          eyebrow={bookmarks.eyebrow}
          title={bookmarks.title}
          description={bookmarks.signedOut}
        />
        <EmptyState
          message={bookmarks.signedOut}
          actionHref={PAGES.HOME}
          actionLabel='Go to home'
        />
      </div>
    );
  }

  const dashboardData = await getDashboardData(currentUser);

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={bookmarks.eyebrow}
        title={bookmarks.title}
        description={bookmarks.description}
      >
        <LinkButton href={PAGES.EXPLORE}>
          Open explore
        </LinkButton>
      </PageHero>

      <TweetList
        tweets={dashboardData.bookmarkedTweets}
        canInteract
        emptyMessage={bookmarks.empty}
        language={language}
      />
    </div>
  );
}
