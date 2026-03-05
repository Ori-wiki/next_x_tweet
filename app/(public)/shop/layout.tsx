'use client';

import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';

const DynamicShopMenu = dynamic(
  () => import('./ShopMenu').then((mod) => mod.ShopMenu),
  { ssr: false, loading: () => <div>Loadij...</div> },
);

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='w-full'>
      <h1 className='mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl'>Shop</h1>
      <DynamicShopMenu />
      {children}
    </div>
  );
}
