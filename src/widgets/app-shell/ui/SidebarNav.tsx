'use client';

import Link from 'next/link';
import { Bell, Bookmark, CircleUserRound, Home, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PAGES } from '@/src/shared/config/pages';
import { cn } from '@/src/shared/lib/cn';

const icons = {
  [PAGES.HOME]: Home,
  [PAGES.EXPLORE]: Search,
  [PAGES.DASHBOARD]: CircleUserRound,
  [PAGES.BOOKMARKS]: Bookmark,
  [PAGES.NOTIFICATIONS]: Bell,
};

interface SidebarNavProps {
  items: Array<{
    href: string;
    name: string;
  }>;
}

export const SidebarNav = ({ items }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <nav className='grid gap-1'>
      {items.map((item) => {
        const Icon = icons[item.href] ?? CircleUserRound;
        const isActive = pathname === item.href || (
          item.href !== PAGES.HOME && pathname.startsWith(item.href)
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group inline-flex items-center gap-4 rounded-full px-3 py-3 text-xl transition hover:bg-[var(--color-surface-hover)]',
              isActive
                ? 'font-bold text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)]',
            )}
          >
            <Icon aria-hidden='true' size={26} />
            <span className='hidden xl:inline'>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
