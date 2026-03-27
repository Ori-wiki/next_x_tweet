import { TweetSkeleton } from '@/app/components/TweetSkeleton';

export default function DashboardLoading() {
  return (
    <div className='space-y-5'>
      <div className='skeleton h-56 rounded-[2rem]' />
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='skeleton h-32 rounded-3xl' />
        <div className='skeleton h-32 rounded-3xl' />
        <div className='skeleton h-32 rounded-3xl' />
      </div>
      <TweetSkeleton />
    </div>
  );
}
