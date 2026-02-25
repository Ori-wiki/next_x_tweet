'use client';

import { useSearchParams } from 'next/navigation';

export const Explore = () => {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  return <div>explore tag: {!!tag && tag}</div>;
};
