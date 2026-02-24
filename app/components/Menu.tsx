'use client';

import { usePathname } from 'next/navigation';
import { MenuItem } from './MenuItem';
import { MENU_ITEMS } from './menu.data';
import { match } from 'path-to-regexp';

export const Menu = () => {
  const pathname = usePathname();

  return (
    <nav className='flex gap-6 text-sm '>
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.href}
          menuItem={item}
          IsActive={!!match(item.href)(pathname)}
        />
      ))}
    </nav>
  );
};
