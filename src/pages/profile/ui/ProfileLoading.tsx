import { TweetSkeleton } from '@/entities/tweet';

export default function ProfileLoading() {
  return (
    <div className='space-y-5'>
      <div className='skeleton h-64 rounded-4xl' />
      <div className='skeleton h-16 rounded-3xl' />
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
