'use client';

import Link from 'next/link';
import {
  Bell,
  Bookmark,
  CircleUserRound,
  Home,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { PAGES } from '@/shared/config/pages';
import { cn } from '@/shared/lib/cn';
import type { MenuItemData } from '../model/menu.data';

interface MobileMenuProps {
  items: MenuItemData[];
}

const icons = {
  [PAGES.HOME]: Home,
  [PAGES.EXPLORE]: Search,
  [PAGES.DASHBOARD]: CircleUserRound,
  [PAGES.BOOKMARKS]: Bookmark,
  [PAGES.NOTIFICATIONS]: Bell,
};

const swipeThreshold = 56;

export const MobileMenu = ({ items }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    let edgeStartX: number | null = null;

    const handleTouchStart = (event: globalThis.TouchEvent) => {
      const clientX = event.touches[0]?.clientX;

      if (!isOpen && clientX !== undefined && clientX <= 28) {
        edgeStartX = clientX;
      }
    };

    const handleTouchEnd = (event: globalThis.TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX;

      if (
        edgeStartX !== null &&
        endX !== undefined &&
        endX - edgeStartX > swipeThreshold
      ) {
        setIsOpen(true);
      }

      edgeStartX = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);

  function rememberTouch(event: TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function finishSwipe(
    event: TouchEvent,
    direction: 'open' | 'close',
  ) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX === null || endX === undefined) {
      return;
    }

    const distance = endX - startX;

    if (direction === 'open' && distance > swipeThreshold) {
      setIsOpen(true);
    }

    if (direction === 'close' && distance < -swipeThreshold) {
      setIsOpen(false);
    }
  }

  const menu = (
    <div
      className={cn(
        'fixed inset-0 z-[200] transition-[visibility] duration-300 sm:hidden',
        isOpen ? 'visible' : 'invisible',
      )}
      aria-hidden={!isOpen}
    >
      <button
        type='button'
        aria-label='Close navigation menu'
        tabIndex={isOpen ? 0 : -1}
        onClick={() => setIsOpen(false)}
        className={cn(
          'absolute inset-0 bg-(--color-overlay) backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role='dialog'
        aria-modal='true'
        aria-label='Navigation menu'
        onTouchStart={rememberTouch}
        onTouchEnd={(event) => finishSwipe(event, 'close')}
        className={cn(
          'absolute inset-y-0 left-0 flex w-[min(82vw,340px)] flex-col border-r border-(--color-border) bg-(--color-background) text-(--color-text-primary) shadow-(--shadow-card) transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex h-16 items-center gap-2 border-b border-(--color-border) px-4'>
          <button
            type='button'
            aria-label='Close navigation menu'
            onClick={() => setIsOpen(false)}
            className='relative inline-flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-(--color-surface-hover)'
          >
            <Menu
              aria-hidden='true'
              size={21}
              className={cn(
                'absolute transition-all duration-300',
                isOpen
                  ? 'rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100',
              )}
            />
            <X
              aria-hidden='true'
              size={22}
              className={cn(
                'absolute transition-all duration-300',
                isOpen
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-0 opacity-0',
              )}
            />
          </button>
          <Link
            href={PAGES.HOME}
            onClick={() => setIsOpen(false)}
            className='inline-flex min-w-0 items-center rounded-full px-2 py-2 font-semibold transition hover:bg-(--color-surface-hover)'
          >
            <span className='truncate'>Next X</span>
          </Link>
        </div>

        <nav
          aria-label='Mobile menu'
          className='flex-1 overflow-y-auto px-3 py-3'
        >
          {items.map((item) => {
            const Icon = icons[item.href] ?? CircleUserRound;
            const isActive =
              pathname === item.href ||
              (item.href !== PAGES.HOME && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group flex min-h-14 items-center gap-4 rounded-full px-3 text-lg transition hover:bg-(--color-surface-hover)',
                  isActive
                    ? 'font-bold text-(--color-text-primary)'
                    : 'text-(--color-text-secondary) hover:text-(--color-text-primary)',
                )}
              >
                <span className='relative inline-flex size-10 shrink-0 items-center justify-center'>
                  <Icon aria-hidden='true' size={25} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive ? (
                    <span className='absolute right-0 top-0 size-2 rounded-full bg-(--color-accent)' />
                  ) : null}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-(--color-border) p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          <p className='text-xs uppercase tracking-[0.18em] text-(--color-text-subtle)'>
            Swipe left to close
          </p>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type='button'
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className='relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) transition hover:bg-(--color-surface-hover)'
      >
        <Menu
          aria-hidden='true'
          size={21}
          className={cn(
            'absolute transition-all duration-300',
            isOpen
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <X
          aria-hidden='true'
          size={22}
          className={cn(
            'absolute transition-all duration-300',
            isOpen
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0',
          )}
        />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(menu, document.body)
        : null}
    </>
  );
};
