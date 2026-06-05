import { EmptyState } from '@/src/shared/ui/EmptyState';
import { LinkButton } from '@/src/shared/ui/LinkButton';
import { PageHero } from '@/src/shared/ui/PageHero';
import { TweetList } from '@/src/entities/tweet/ui/TweetList';
import { PAGES } from '@/src/shared/config/pages';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDashboardData } from '@/src/entities/tweet';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';

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
