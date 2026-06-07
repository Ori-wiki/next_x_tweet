'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserRound } from 'lucide-react';
import { loginAction } from '../model/actions';
import { getDictionary } from '@/shared/lib/i18n';
import {
  type UserLanguage,
  type UserRecord,
} from '@/entities/user';
import { UserAvatar } from '@/entities/user/ui';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';

interface DemoRolePickerProps {
  users: UserRecord[];
  language?: UserLanguage;
  compact?: boolean;
}

export const DemoRolePicker = ({
  users,
  language,
  compact = false,
}: DemoRolePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, common, demoRolePicker } = getDictionary(language);

  const modal = isOpen ? (
    <div className='fixed inset-0 z-[100] overflow-y-auto bg-(--color-overlay) p-4 backdrop-blur-md'>
      <div className='flex min-h-full items-start justify-center py-4 sm:items-center'>
        <SurfaceCard className='relative my-auto w-full max-w-3xl space-y-8 px-6 py-7 shadow-2xl shadow-(--shadow-accent) sm:px-8 sm:py-8'>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='absolute right-5 top-5 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-sm text-(--color-text-secondary) transition hover:border-(--color-border-hover) hover:bg-(--color-surface-raised) hover:text-(--color-text-primary)'
          >
            {common.close}
          </button>

          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--color-accent-muted)'>
              {common.demoMode}
            </p>
            <h2 className='mt-3 text-3xl font-semibold leading-tight text-(--color-text-primary) sm:text-4xl'>
              {demoRolePicker.title}
            </h2>
            <p className='mx-auto mt-3 max-w-xl text-base leading-7 text-(--color-text-secondary)'>
              {demoRolePicker.description}
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {users.map((user) => (
              <form key={user.id} action={loginAction}>
                <input type='hidden' name='userId' value={user.id} />
                <button
                  type='submit'
                  className='flex h-full w-full flex-col rounded-3xl border border-(--color-border) bg-(--color-overlay) p-5 text-left shadow-lg shadow-black/10 transition hover:cursor-pointer hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface)'
                >
                  <UserAvatar
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    sizes='56px'
                    className='size-14'
                  />
                  <span className='mt-4 text-lg font-semibold text-(--color-text-primary)'>
                    {user.name}
                  </span>
                  <span className='mt-1 text-sm font-medium text-(--color-accent-text)'>
                    @{user.username}
                  </span>
                  <span className='mt-3 text-sm leading-6 text-(--color-text-secondary)'>
                    {user.bio}
                  </span>
                </button>
              </form>
            ))}
          </div>

          <div className='mx-auto max-w-2xl rounded-3xl border border-dashed border-(--color-border) bg-(--color-surface-dark) px-5 py-4 text-center text-sm leading-6 text-(--color-text-muted)'>
            {demoRolePicker.tour}
          </div>
        </SurfaceCard>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        aria-label={compact ? auth.chooseDemoRole : undefined}
        title={compact ? auth.chooseDemoRole : undefined}
        className={
          compact
            ? 'inline-flex size-9 items-center justify-center rounded-full border border-(--color-accent-border) bg-(--color-accent-surface) text-(--color-accent-text-strong) transition hover:cursor-pointer hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface-hover)'
            : 'rounded-full border border-(--color-accent-border) bg-(--color-accent-surface) px-4 py-2 text-sm text-(--color-accent-text-strong) transition hover:cursor-pointer hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface-hover)'
        }
      >
        {compact ? <UserRound aria-hidden='true' size={18} /> : auth.chooseDemoRole}
      </button>
      {typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </>
  );
};
