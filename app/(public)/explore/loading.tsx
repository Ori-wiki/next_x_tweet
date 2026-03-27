import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';

export default function ExploreLoading() {
  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow='Discover'
        title='Loading explore'
        description='Preparing search suggestions, trends and result cards.'
      />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
