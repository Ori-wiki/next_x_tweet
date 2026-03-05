'use client';

import { PAGES } from '@/app/config/pages.config';
import { useRouter } from 'next/navigation';

export const ProfileButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(PAGES.HOME)}
      className='w-full rounded bg-blue-500 px-4 py-2 font-bold text-white transition hover:bg-blue-700 sm:w-auto'
    >
      Go to home
    </button>
  );
};
