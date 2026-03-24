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
        'whitespace-nowrap transition-colors',
        isActive ? 'text-white' : 'text-white/80 hover:text-white',
      )}
      href={item.href}
    >
      {item.name}
    </Link>
  );
};
