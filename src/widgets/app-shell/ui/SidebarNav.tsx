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
  badges?: Record<string, number>;
  items: Array<{
    href: string;
    name: string;
  }>;
  mobile?: boolean;
}

export const SidebarNav = ({
  badges = {},
  items,
  mobile = false,
}: SidebarNavProps) => {
  const pathname = usePathname() ?? '';

  return (
    <nav
      aria-label={mobile ? 'Mobile navigation' : 'Primary navigation'}
      className={mobile ? 'grid w-full min-w-0 grid-cols-5 overflow-hidden' : 'grid gap-1'}
    >
      {items.map((item) => {
        const Icon = icons[item.href] ?? CircleUserRound;
        const badge = badges[item.href] ?? 0;
        const isActive = pathname === item.href || (
          item.href !== PAGES.HOME && pathname.startsWith(item.href)
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              mobile
                ? 'group relative flex min-w-0 overflow-hidden flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[9px] leading-none transition'
                : 'group relative inline-flex size-12 items-center justify-center rounded-full text-xl transition hover:bg-(--color-surface-hover) xl:w-auto xl:justify-start xl:gap-4 xl:px-3',
              isActive
                ? 'font-bold text-(--color-text-primary)'
                : 'text-(--color-text-secondary)',
            )}
          >
            <span
              className={cn(
                'relative flex items-center justify-center rounded-full transition',
                mobile && 'h-8 w-12',
                mobile && isActive && 'bg-(--color-accent-surface)',
              )}
            >
              <Icon aria-hidden='true' size={mobile ? 22 : 26} />
              {mobile && isActive ? (
                <span
                  aria-hidden='true'
                  className='absolute -bottom-1 h-0.5 w-4 rounded-full bg-(--color-accent)'
                />
              ) : null}
              {badge > 0 ? (
                <span
                  aria-label={`${badge} notifications`}
                  className={cn(
                    'absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-(--color-danger) px-1 text-[10px] font-bold leading-4 text-(--color-background)',
                    !mobile && 'xl:-right-2 xl:-top-1',
                  )}
                >
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </span>
            <span className={mobile ? 'block w-full truncate text-center' : 'hidden xl:inline'}>
              {item.name}
            </span>
            {isActive ? (
              <span
                aria-hidden='true'
                className={cn(
                  'absolute right-1 top-1 size-2 rounded-full bg-(--color-accent) xl:hidden',
                  mobile && 'hidden',
                )}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
