'use client';

import { MenuItem } from '@/app/components/MenuItem';
import { PAGES } from '@/app/config/pages.config';
import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';

const pageNotes = [
  {
    href: PAGES.SHOP,
    name: 'SSR',
    note: 'Always fresh data using no-store.',
  },
  {
    href: PAGES.SSG,
    name: 'SSG',
    note: 'Static response created ahead of time.',
  },
  {
    href: PAGES.ISR,
    name: 'ISR',
    note: 'Cached page with timed background refresh.',
  },
];

export const ShopMenu = () => {
  const pathname = usePathname();

  return (
    <div className='grid gap-3 md:grid-cols-3'>
      {pageNotes.map((item) => (
        <div
          key={item.href}
          className='rounded-3xl border border-white/10 bg-white/[0.03] p-4'
        >
          <MenuItem
            menuItem={{ href: item.href, name: item.name }}
            IsActive={!!match(item.href)(pathname)}
          />
          <p className='mt-2 text-sm text-white/60'>{item.note}</p>
        </div>
      ))}
    </div>
  );
};
