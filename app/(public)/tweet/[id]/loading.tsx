import { PageHero } from '@/app/components/PageHero';
import { TweetSkeleton } from '@/app/components/TweetSkeleton';

export default function TweetLoading() {
  return (
    <div className='space-y-5'>
      <PageHero
        eyebrow='Thread'
        title='Loading conversation'
        description='Preparing parent tweet, focus tweet and replies.'
      />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
