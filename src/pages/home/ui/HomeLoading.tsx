import { PageHero } from '@/shared/ui/PageHero';
import { TweetSkeleton } from '@/entities/tweet';
import { getSessionUser } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';

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
