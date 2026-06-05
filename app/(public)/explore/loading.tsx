import { PageHero } from '@/src/shared/ui/PageHero';
import { TweetSkeleton } from '@/src/entities/tweet/ui/TweetSkeleton';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';

export default async function ExploreLoading() {
  const currentUser = await getSessionUser();
  const { explore } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow={explore.eyebrow}
        title={explore.title}
        description={explore.description}
      />
      <section className='space-y-3'>
        <p className='text-sm text-[var(--color-text-soft)]'>{explore.loadingTitle}</p>
        <TweetSkeleton />
        <TweetSkeleton />
      </section>
    </div>
  );
}
