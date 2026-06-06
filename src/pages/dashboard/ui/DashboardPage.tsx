import { EmptyState } from '@/shared/ui/EmptyState';
import { LinkButton } from '@/shared/ui/LinkButton';
import { PageHero } from '@/shared/ui/PageHero';
import { StatCard } from '@/shared/ui/StatCard';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { TweetList } from '@/widgets/tweet-feed';
import { PAGES } from '@/shared/config/pages';
import { getSessionUser } from '@/entities/user';
import { UserAvatar } from '@/entities/user/ui';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { getDashboardData } from '@/entities/tweet';

export default async function DashboardPageView() {
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
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
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
          tweets={dashboardData.bookmarkedTweets.slice(0, 3)}
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

      <aside className='space-y-4 lg:sticky lg:top-8 lg:self-start'>
        <SurfaceCard className='p-5'>
          <div className='flex items-center gap-3'>
            <UserAvatar
              src={currentUser.avatar}
              alt={`${currentUser.name} avatar`}
              sizes='48px'
              className='size-12'
            />
            <div className='min-w-0'>
              <p className='truncate font-semibold text-(--color-text-primary)'>{currentUser.name}</p>
              <p className='truncate text-sm text-(--color-accent-text)'>@{currentUser.username}</p>
            </div>
          </div>
          <div className='mt-4 grid gap-2'>
            <LinkButton href={PAGES.BOOKMARKS} variant='solid'>
              {currentDict.dashboard.viewAllBookmarks}
            </LinkButton>
            <LinkButton href={PAGES.NOTIFICATIONS}>
              {currentDict.common.notifications}
            </LinkButton>
          </div>
        </SurfaceCard>
      </aside>
    </div>
  );
}
