'use client';

import { useSearchParams } from 'next/navigation';

export const Explore = () => {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  return (
    <div className='w-full'>
      <h1 className='mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl'>Explore</h1>
      <p className='break-words text-base text-white/90'>
        explore tag: {!!tag && tag}
      </p>
    </div>
  );
};
