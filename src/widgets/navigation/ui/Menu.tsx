'use client';

import { usePathname } from 'next/navigation';
import { isRouteActive } from '@/src/shared/lib/routing';
import type { UserLanguage } from '@/src/entities/user/model/types';
import { MenuItem } from './MenuItem';
import { getMenuItems } from '@/src/widgets/navigation/model/menu.data';

interface MenuProps {
  language?: UserLanguage;
}

export const Menu = ({ language }: MenuProps) => {
  const pathname = usePathname();
  const items = getMenuItems(language);

  return (
    <nav className='-mx-4 flex gap-2 overflow-x-auto px-4 text-sm sm:mx-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0'>
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
