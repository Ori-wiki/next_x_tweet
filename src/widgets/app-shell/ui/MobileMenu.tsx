'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import type { MenuItemData } from '../model/menu.data';

interface MobileMenuProps {
  items: MenuItemData[];
}

export const MobileMenu = ({ items }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const menu = isOpen ? (
    <div
      className='fixed inset-0 z-[200] bg-black/80 backdrop-blur-md'
      onClick={() => setIsOpen(false)}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Navigation menu'
        className='ml-auto flex h-[100dvh] w-[min(86vw,340px)] flex-col border-l border-(--color-border-hover) bg-(--color-background) p-4 shadow-2xl shadow-black'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='mb-5 flex items-center justify-between'>
          <p className='text-lg font-bold'>Menu</p>
          <button
            type='button'
            aria-label='Close navigation menu'
            onClick={() => setIsOpen(false)}
            className='inline-flex size-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface)'
          >
            <X aria-hidden='true' size={20} />
          </button>
        </div>

        <nav aria-label='Mobile menu' className='grid gap-2'>
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-2xl border px-4 py-3 text-base font-medium transition',
                  isActive
                    ? 'border-(--color-accent-border-hover) bg-(--color-accent-surface-hover) text-(--color-accent-text-strong)'
                    : 'border-(--color-border) bg-(--color-surface-dark-medium) text-(--color-text-secondary)',
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type='button'
        aria-label='Open navigation menu'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className='inline-flex size-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-primary)'
      >
        <Menu aria-hidden='true' size={21} />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(menu, document.body)
        : null}
    </>
  );
};
