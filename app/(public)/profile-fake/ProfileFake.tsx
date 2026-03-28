import { EmptyState } from '@/app/components/EmptyState';
import { LinkButton } from '@/app/components/LinkButton';
import { PageHero } from '@/app/components/PageHero';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { StatCard } from '@/app/components/StatCard';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { PAGES } from '@/app/config/pages.config';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getDashboardData } from '@/app/shared/lib/tweets';

export const ProfileFake = async () => {
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
          className='bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)]'
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
  const guideSteps = [
    currentDict.dashboard.stepOne,
    currentDict.dashboard.stepTwo,
    currentDict.dashboard.stepThree,
  ];

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow={currentDict.common.dashboard}
        title={currentDict.dashboard.title}
        description={currentDict.dashboard.description}
        className='bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)]'
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
          <div key={stat.label}>
            <StatCard label={stat.label} value={stat.value} accent={stat.accent} />
            {'helper' in stat ? (
              <p className='mt-2 px-2 text-sm text-sky-200'>{stat.helper}</p>
            ) : null}
          </div>
        ))}
      </section>

      <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]'>
        <SurfaceCard className='p-5'>
          <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
            {currentDict.dashboard.onboarding}
          </p>
          <h2 className='mt-2 text-xl font-semibold text-white'>
            {currentDict.dashboard.quickTour}
          </h2>
          <div className='mt-4 space-y-3 text-sm text-white/65'>
            {guideSteps.map((step, index) => (
              <p key={step}>
                {index + 1}. {step}
              </p>
            ))}
          </div>
        </SurfaceCard>
        <SettingsPanel settings={currentUser.settings} />
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
