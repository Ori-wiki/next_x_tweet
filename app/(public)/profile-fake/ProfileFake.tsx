import { EmptyState } from '@/app/components/EmptyState';
import { LinkButton } from '@/app/components/LinkButton';
import { PageHero } from '@/app/components/PageHero';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { StatCard } from '@/app/components/StatCard';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { PAGES } from '@/app/config/pages.config';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDashboardData } from '@/app/shared/lib/tweets';

export const ProfileFake = async () => {
  const currentUser = await getSessionUser();
  const onboardingSteps = [
    'Post a tweet with an image or link from the home timeline.',
    'Open Explore to search authors, hashtags and top tweets.',
    'Visit any tweet thread to reply or copy a direct link.',
  ];

  if (!currentUser) {
    return (
      <div className='space-y-6'>
        <PageHero
          eyebrow='Dashboard'
          title='Sign in to open your demo dashboard'
          description='After sign-in you will see your profile summary, likes and saved tweets here.'
          className='bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)]'
        >
          <div className='flex flex-wrap gap-3'>
            <LinkButton href={PAGES.HOME} variant='solid'>
              Go to home
            </LinkButton>
            <LinkButton href={PAGES.EXPLORE}>
              Open explore
            </LinkButton>
          </div>
        </PageHero>

        <EmptyState message='You are signed out. Use one of the demo accounts in the header to open the dashboard.' />
      </div>
    );
  }

  const dashboard = await getDashboardData(currentUser);
  const stats = [
    { label: 'User', value: currentUser.name, accent: 'text-xl', helper: `@${currentUser.username}` },
    { label: 'Liked tweets', value: dashboard.likedTweets.length },
    { label: 'Bookmarks', value: dashboard.bookmarkedTweets.length },
  ];

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow='Dashboard'
        title='Your demo dashboard'
        description='This page summarizes your account, bookmarks and quick actions for the current demo session.'
        className='bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),rgba(255,255,255,0.03)]'
      >
        <div className='flex flex-wrap gap-3'>
          <LinkButton href={PAGES.PROFILE(currentUser.username)} variant='solid'>
            Open public profile
          </LinkButton>
          <LinkButton href={PAGES.EXPLORE}>
            Open explore
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
            Onboarding
          </p>
          <h2 className='mt-2 text-xl font-semibold text-white'>Quick tour</h2>
          <div className='mt-4 space-y-3 text-sm text-white/65'>
            {onboardingSteps.map((step, index) => (
              <p key={step}>
                {index + 1}. {step}
              </p>
            ))}
          </div>
        </SurfaceCard>
        <SettingsPanel settings={currentUser.settings} />
      </section>

      <TweetList
        title='Saved tweets'
        tweets={dashboard.bookmarkedTweets}
        canInteract
        emptyMessage='No bookmarks yet. Save a few tweets from the timeline to see them here.'
      />

      <TweetList
        title='Reposted tweets'
        tweets={dashboard.repostedTweets}
        canInteract
        emptyMessage='No reposts yet. Repost a few tweets to keep them here.'
      />
    </div>
  );
};
