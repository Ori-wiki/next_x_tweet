'use client';

import { usePathname } from 'next/navigation';
import { isRouteActive } from '@/app/shared/lib/routing';
import type { UserLanguage } from '@/app/shared/types/user.interface';
import { MenuItem } from './MenuItem';
import { getMenuItems } from './menu.data';

interface MenuProps {
  language?: UserLanguage;
}

export const Menu = ({ language }: MenuProps) => {
  const pathname = usePathname();
  const items = getMenuItems(language);

  return (
    <nav className='flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm sm:gap-x-6'>
      {items.map((item) => (
        <MenuItem
          key={item.href}
          item={item}
          isActive={isRouteActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
};
