import { PageHero } from '@/shared/ui/PageHero';
import { TweetSkeleton } from '@/entities/tweet';
import { getSessionUser } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';

export default async function TweetLoading() {
  const currentUser = await getSessionUser();
  const { thread } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={thread.eyebrow}
        title={thread.loadingTitle}
        description={thread.loadingDescription}
      />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
