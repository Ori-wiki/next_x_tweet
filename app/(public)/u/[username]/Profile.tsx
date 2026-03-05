'use client';

import { useParams } from 'next/navigation';

export const Profile = () => {
  const params = useParams<{ username: string }>();

  return (
    <div className='w-full'>
      <h1 className='text-2xl font-bold sm:text-3xl'>Profile @{params.username}</h1>
    </div>
  );
};
