import { SurfaceCard } from './SurfaceCard';

export const TweetSkeleton = () => {
  return (
    <SurfaceCard className='space-y-4 p-5 shadow-[var(--shadow-card)]'>
      <div className='flex items-center gap-3'>
        <div className='skeleton h-11 w-11 rounded-full' />
        <div className='space-y-2'>
          <div className='skeleton h-4 w-32 rounded-full' />
          <div className='skeleton h-3 w-20 rounded-full' />
        </div>
      </div>
      <div className='space-y-2'>
        <div className='skeleton h-4 w-full rounded-full' />
        <div className='skeleton h-4 w-11/12 rounded-full' />
        <div className='skeleton h-4 w-8/12 rounded-full' />
      </div>
      <div className='grid gap-2 sm:grid-cols-4'>
        <div className='skeleton h-10 rounded-full' />
        <div className='skeleton h-10 rounded-full' />
        <div className='skeleton h-10 rounded-full' />
        <div className='skeleton h-10 rounded-full' />
      </div>
    </SurfaceCard>
  );
};
