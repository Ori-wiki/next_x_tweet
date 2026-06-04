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
        'inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 font-semibold transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
        isActive
          ? 'border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] text-[var(--color-accent)]'
          : 'border-transparent text-[var(--color-text-secondary)]',
      )}
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.name}
    </Link>
  );
};
