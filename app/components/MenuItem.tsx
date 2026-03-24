import Link from 'next/link';
import { cn } from '@/app/shared/lib/cn';
import type { MenuItemData } from './menu.data';

interface MenuItemProps {
  item: MenuItemData;
  isActive: boolean;
}

export const MenuItem = ({ item, isActive }: MenuItemProps) => {
  return (
    <Link
      className={cn(
        'inline-flex items-center px-1 py-1 whitespace-nowrap transition-colors',
        isActive
          ? 'font-semibold text-sky-300!'
          : 'text-white/45 hover:text-white/75',
      )}
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.name}
    </Link>
  );
};
