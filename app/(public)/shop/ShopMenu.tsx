'use client';

import { MenuItem } from '@/app/components/MenuItem';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { PAGES } from '@/app/config/pages.config';
import { getDictionary } from '@/app/shared/lib/i18n';
import type { UserLanguage } from '@/app/shared/types/user.interface';
import { usePathname } from 'next/navigation';

interface ShopMenuProps {
  language?: UserLanguage;
}

function isShopPageActive(pathname: string, href: string) {
  if (href === PAGES.SHOP) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const ShopMenu = ({ language }: ShopMenuProps) => {
  const pathname = usePathname();
  const { shop } = getDictionary(language);
  const pageNotes = [
    {
      href: PAGES.SHOP,
      name: 'SSR',
      note: shop.ssrNote,
    },
    {
      href: PAGES.SSG,
      name: 'SSG',
      note: shop.ssgNote,
    },
    {
      href: PAGES.ISR,
      name: 'ISR',
      note: shop.isrNote,
    },
  ];

  return (
    <div className='grid gap-3 md:grid-cols-3'>
      {pageNotes.map((item) => (
        <SurfaceCard key={item.href} className='p-4'>
          <MenuItem
            item={{ href: item.href, name: item.name }}
            isActive={isShopPageActive(pathname, item.href)}
          />
          <p className='mt-2 text-sm text-[var(--color-text-soft)]'>{item.note}</p>
        </SurfaceCard>
      ))}
    </div>
  );
};
