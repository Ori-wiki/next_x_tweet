'use client';

import { PAGES } from '@/app/config/pages.config';
import { useRouter } from 'next/navigation';

export const ProfileFake = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-6'>Profile Fake</h1>
      <button
        onClick={() => router.push(PAGES.HOME)}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Go to home
      </button>
    </div>
  );
};
