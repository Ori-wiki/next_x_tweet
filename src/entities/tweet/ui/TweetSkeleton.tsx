import { SurfaceCard } from '@/shared/ui/SurfaceCard';

export const TweetSkeleton = () => {
  return (
    <SurfaceCard className='space-y-4 p-3.5 shadow-(--shadow-card) sm:p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='skeleton size-10 rounded-full sm:size-11' />
          <div className='min-w-0 space-y-2'>
            <div className='flex gap-2'>
              <div className='skeleton h-4 w-28 rounded-full' />
              <div className='skeleton h-4 w-16 rounded-full' />
            </div>
            <div className='skeleton h-3 w-24 rounded-full' />
          </div>
        </div>
        <div className='skeleton h-5 w-5 rounded-full opacity-70' />
      </div>
      <div className='space-y-2'>
        <div className='skeleton h-4 w-full rounded-full' />
        <div className='skeleton h-4 w-11/12 rounded-full' />
        <div className='skeleton h-4 w-7/12 rounded-full' />
      </div>
      <div className='skeleton aspect-[16/8] rounded-2xl sm:rounded-3xl' />
      <div className='flex gap-3'>
        <div className='skeleton h-3 w-20 rounded-full' />
        <div className='skeleton h-3 w-16 rounded-full' />
        <div className='skeleton h-3 w-18 rounded-full' />
      </div>
      <div className='grid grid-cols-5 gap-0 sm:flex sm:gap-3'>
        <div className='skeleton mx-1 h-11 rounded-full sm:mx-0 sm:w-27' />
        <div className='skeleton mx-1 h-11 rounded-full sm:mx-0 sm:w-27' />
        <div className='skeleton mx-1 h-11 rounded-full sm:mx-0 sm:w-27' />
        <div className='skeleton mx-1 h-11 rounded-full sm:mx-0 sm:w-27' />
        <div className='skeleton mx-1 h-11 rounded-full sm:mx-0 sm:w-27' />
      </div>
    </SurfaceCard>
  );
};
