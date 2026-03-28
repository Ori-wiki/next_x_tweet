'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { loginAction } from '@/app/server-actions/post-tweet';
import { getDictionary } from '@/app/shared/lib/i18n';
import type { UserRecord } from '@/app/shared/types/user.interface';
import type { UserLanguage } from '@/app/shared/types/user.interface';
import { SurfaceCard } from './SurfaceCard';

interface DemoRolePickerProps {
  users: UserRecord[];
  language?: UserLanguage;
}

export const DemoRolePicker = ({ users, language }: DemoRolePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, common, demoRolePicker } = getDictionary(language);

  const modal = isOpen ? (
    <div className='fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md'>
      <div className='flex min-h-full items-start justify-center py-4 sm:items-center'>
        <SurfaceCard className='relative my-auto w-full max-w-3xl space-y-8 px-6 py-7 shadow-2xl shadow-sky-950/25 sm:px-8 sm:py-8'>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white'
          >
            {common.close}
          </button>

          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/70'>
              {common.demoMode}
            </p>
            <h2 className='mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl'>
              {demoRolePicker.title}
            </h2>
            <p className='mx-auto mt-3 max-w-xl text-base leading-7 text-white/70'>
              {demoRolePicker.description}
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {users.map((user) => (
              <form key={user.id} action={loginAction}>
                <input type='hidden' name='userId' value={user.id} />
                <button
                  type='submit'
                  className='flex h-full w-full flex-col rounded-3xl border border-white/12 bg-slate-950/65 p-5 text-left shadow-lg shadow-black/10 transition hover:cursor-pointer hover:border-sky-300/45 hover:bg-sky-400/10'
                >
                  <span className='flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-semibold text-black'>
                    {user.avatar}
                  </span>
                  <span className='mt-4 text-lg font-semibold text-white'>
                    {user.name}
                  </span>
                  <span className='mt-1 text-sm font-medium text-sky-200'>
                    @{user.username}
                  </span>
                  <span className='mt-3 text-sm leading-6 text-white/72'>
                    {user.bio}
                  </span>
                </button>
              </form>
            ))}
          </div>

          <div className='mx-auto max-w-2xl rounded-3xl border border-dashed border-white/10 bg-black/20 px-5 py-4 text-center text-sm leading-6 text-white/65'>
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
        className='rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:cursor-pointer hover:border-sky-300/40 hover:bg-sky-400/15'
      >
        {auth.chooseDemoRole}
      </button>
      {typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </>
  );
};
