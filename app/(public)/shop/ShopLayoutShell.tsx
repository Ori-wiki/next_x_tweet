'use client';

import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';
import type { UserLanguage } from '@/app/shared/types/user.interface';

const DynamicShopMenu = dynamic(
  () => import('./ShopMenu').then((mod) => mod.ShopMenu),
  {
    ssr: false,
    loading: () => null,
  },
);

interface ShopLayoutShellProps extends PropsWithChildren {
  language?: UserLanguage;
}

export const ShopLayoutShell = ({
  children,
  language,
}: ShopLayoutShellProps) => {
  return (
    <>
      <DynamicShopMenu language={language} />
      {children}
    </>
  );
};
