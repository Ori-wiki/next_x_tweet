'use client';

import { usePathname } from 'next/navigation';
import { isRouteActive } from '@/app/shared/lib/routing';
import { MenuItem } from './MenuItem';
import { MENU_ITEMS } from './menu.data';

export const Menu = () => {
  const pathname = usePathname();

  return (
    <nav className='flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm sm:gap-x-6'>
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.href}
          item={item}
          isActive={isRouteActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
};
