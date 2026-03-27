'use client';

import { useState } from 'react';
import { loginAction } from '@/app/server-actions/post-tweet';
import type { UserRecord } from '@/app/shared/types/user.interface';
import { SurfaceCard } from './SurfaceCard';

interface DemoRolePickerProps {
  users: UserRecord[];
}

export const DemoRolePicker = ({ users }: DemoRolePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:cursor-pointer hover:border-sky-300/40 hover:bg-sky-400/15'
      >
        Choose demo role
      </button>

      {isOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm'>
          <SurfaceCard className='w-full max-w-2xl space-y-5 p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
                  Demo mode
                </p>
                <h2 className='mt-2 text-2xl font-semibold text-white'>
                  Pick a role and start exploring
                </h2>
                <p className='mt-2 text-white/65'>
                  Each demo account has its own follows, bookmarks and settings.
                </p>
              </div>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 transition hover:border-white/20 hover:text-white'
              >
                Close
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              {users.map((user) => (
                <form key={user.id} action={loginAction}>
                  <input type='hidden' name='userId' value={user.id} />
                  <button
                    type='submit'
                    className='flex h-full w-full flex-col rounded-3xl border border-white/10 bg-black/20 p-4 text-left transition hover:cursor-pointer hover:border-sky-300/35 hover:bg-sky-400/8'
                  >
                    <span className='flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-semibold text-black'>
                      {user.avatar}
                    </span>
                    <span className='mt-4 text-lg font-semibold text-white'>
                      {user.name}
                    </span>
                    <span className='text-sm text-sky-200'>@{user.username}</span>
                    <span className='mt-3 text-sm text-white/65'>{user.bio}</span>
                  </button>
                </form>
              ))}
            </div>

            <div className='rounded-3xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/60'>
              Tour: publish a tweet on Home, explore authors and hashtags on Explore,
              then open Dashboard to adjust theme, density and language.
            </div>
          </SurfaceCard>
        </div>
      ) : null}
    </>
  );
};
