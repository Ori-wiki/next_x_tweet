import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';

export default function HomeLoading() {
  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow='Home timeline'
        title='Loading timeline'
        description='Pulling the latest demo tweets and profile actions.'
      />
      <TweetSkeleton />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
