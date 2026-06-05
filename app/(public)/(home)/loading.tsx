import { PageHero } from '@/src/shared/ui/PageHero';
import { TweetSkeleton } from '@/src/entities/tweet/ui/TweetSkeleton';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';

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
