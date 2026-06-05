import { PageHero } from '@/src/shared/ui/PageHero';
import { TweetSkeleton } from '@/src/entities/tweet/ui/TweetSkeleton';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';

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
