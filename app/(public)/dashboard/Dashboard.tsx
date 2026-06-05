import { EmptyState } from '@/src/shared/ui/EmptyState';
import { LinkButton } from '@/src/shared/ui/LinkButton';
import { PageHero } from '@/src/shared/ui/PageHero';
import { StatCard } from '@/src/shared/ui/StatCard';
import { TweetList } from '@/src/entities/tweet/ui/TweetList';
import { PAGES } from '@/src/shared/config/pages';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { getDashboardData } from '@/src/entities/tweet/model/selectors';

export const Dashboard = async () => {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { dashboard: dashboardText, profile: profileText } = getDictionary(language);

  if (!currentUser) {
    return (
      <div className='space-y-6'>
        <PageHero
          eyebrow={dashboardText.title}
          title={dashboardText.signedOutTitle}
          description={dashboardText.signedOutDescription}
        >
          <div className='flex flex-wrap gap-3'>
            <LinkButton href={PAGES.HOME} variant='solid'>
              {dashboardText.goHome}
            </LinkButton>
            <LinkButton href={PAGES.EXPLORE}>
              {dashboardText.openExplore}
            </LinkButton>
          </div>
        </PageHero>

        <EmptyState message={dashboardText.signedOutMessage} />
      </div>
    );
  }

  const currentLanguage = resolveLanguage(currentUser.settings);
  const currentDict = getDictionary(currentLanguage);
  const dashboardData = await getDashboardData(currentUser);
  const stats = [
    {
      label: profileText.user,
      value: currentUser.name,
      accent: 'text-xl',
      helper: `@${currentUser.username}`,
    },
    {
      label: currentDict.dashboard.likedTweets,
      value: dashboardData.likedTweets.length,
    },
    {
      label: currentDict.dashboard.bookmarks,
      value: dashboardData.bookmarkedTweets.length,
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow={currentDict.common.dashboard}
        title={currentDict.dashboard.title}
        description={currentDict.dashboard.description}
      >
        <div className='flex flex-wrap gap-3'>
          <LinkButton href={PAGES.PROFILE(currentUser.username)} variant='solid'>
            {currentDict.dashboard.openPublicProfile}
          </LinkButton>
          <LinkButton href={PAGES.EXPLORE}>
            {currentDict.dashboard.openExplore}
          </LinkButton>
        </div>
      </PageHero>

      <section className='grid gap-4 md:grid-cols-3'>
        {stats.map((stat) => (
          <div key={stat.label} className='h-full'>
            <StatCard
              label={stat.label}
              value={stat.value}
              accent={stat.accent}
              helper={'helper' in stat ? stat.helper : undefined}
            />
          </div>
        ))}
      </section>

      <TweetList
        title={currentDict.dashboard.savedTweets}
        tweets={dashboardData.bookmarkedTweets}
        canInteract
        emptyMessage={currentDict.dashboard.noBookmarks}
        language={currentLanguage}
      />

      <TweetList
        title={currentDict.dashboard.repostedTweets}
        tweets={dashboardData.repostedTweets}
        canInteract
        emptyMessage={currentDict.dashboard.noReposts}
        language={currentLanguage}
      />
    </div>
  );
};
