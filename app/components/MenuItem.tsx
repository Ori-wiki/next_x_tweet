import Link from 'next/link';
import { IMenuItem } from './menu.data';

interface MenuItemProps {
  menuItem: IMenuItem;
  IsActive: boolean;
}

export const MenuItem = ({ menuItem, IsActive }: MenuItemProps) => {
  return (
    <Link
      className={`whitespace-nowrap transition-colors ${
        IsActive ? 'text-white' : 'text-white/80 hover:text-white'
      }`}
      href={menuItem.href}
    >
      {menuItem.name}
    </Link>
  );
};
