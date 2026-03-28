import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';

export default async function HomeLoading() {
  const currentUser = await getSessionUser();
  const { home } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={home.eyebrow}
        title={home.loadingTitle}
        description={home.loadingDescription}
      />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
