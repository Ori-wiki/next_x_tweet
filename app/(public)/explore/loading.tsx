import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';

export default async function ExploreLoading() {
  const currentUser = await getSessionUser();
  const { explore } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={explore.eyebrow}
        title={explore.loadingTitle}
        description={explore.loadingDescription}
      />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
