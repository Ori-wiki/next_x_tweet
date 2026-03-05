'use client';

import { MenuItem } from '@/app/components/MenuItem';
import { PAGES } from '@/app/config/pages.config';
import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

export const ShopMenu = () => {
  const pathname = usePathname();

  return (
    <nav className='mb-5 flex flex-wrap items-center gap-4'>
      <MenuItem
        menuItem={{ href: PAGES.SHOP, name: 'SSR' }}
        IsActive={!!match(PAGES.SHOP)(pathname)}
      />
      <MenuItem
        menuItem={{ href: PAGES.SSG, name: 'SSG' }}
        IsActive={!!match(PAGES.SSG)(pathname)}
      />
      <MenuItem
        menuItem={{ href: PAGES.ISR, name: 'ISR' }}
        IsActive={!!match(PAGES.ISR)(pathname)}
      />
    </nav>
  );
};
