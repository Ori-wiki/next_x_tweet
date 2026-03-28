import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';

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
