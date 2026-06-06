import { PageHero } from '@/shared/ui/PageHero';
import { TweetSkeleton } from '@/entities/tweet';
import { getSessionUser } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';

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
