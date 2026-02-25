'use client';

import { PAGES } from '@/app/config/pages.config';
import { useRouter } from 'next/navigation';

export const ProfileButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(PAGES.HOME)}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    >
      Go to home
    </button>
  );
};
