'use client';

import Link from 'next/link';
import { Bell, Bookmark, CircleUserRound, Home, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PAGES } from '@/shared/config/pages';
import { cn } from '@/shared/lib/cn';

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
  const pathname = usePathname() ?? '';

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
              'group relative inline-flex size-12 items-center justify-center rounded-full text-xl transition hover:bg-(--color-surface-hover) xl:w-auto xl:justify-start xl:gap-4 xl:px-3',
              isActive
                ? 'font-bold text-(--color-text-primary)'
                : 'text-(--color-text-secondary)',
            )}
          >
            <Icon aria-hidden='true' size={26} />
            <span className='hidden xl:inline'>{item.name}</span>
            {isActive ? (
              <span
                aria-hidden='true'
                className='absolute right-1 top-1 size-2 rounded-full bg-(--color-accent) xl:hidden'
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
