'use client';

import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';

const DynamicShopMenu = dynamic(
  () => import('./ShopMenu').then((mod) => mod.ShopMenu),
  {
    ssr: false,
    loading: () => (
      <div className='mb-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60'>
        Loading shop navigation...
      </div>
    ),
  },
);

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='w-full space-y-5'>
      <div className='rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_45%),rgba(255,255,255,0.03)] p-6'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          Data fetching lab
        </p>
        <h1 className='mt-2 text-2xl font-bold text-white sm:text-3xl'>Shop</h1>
        <p className='mt-3 max-w-2xl text-white/70'>
          Один и тот же список товаров показан в режимах SSR, SSG и ISR, чтобы
          можно было сравнить свежесть данных и стратегию рендера прямо в интерфейсе.
        </p>
      </div>
      <DynamicShopMenu />
      {children}
    </div>
  );
}
