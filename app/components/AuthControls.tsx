import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { loginAction, logoutAction } from '@/app/server-actions/post-tweet';
import { getSessionUser } from '@/app/shared/lib/auth';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import { DemoRolePicker } from './DemoRolePicker';
import { SurfaceCard } from './SurfaceCard';

export const AuthControls = async () => {
  const currentUser = await getSessionUser();

  if (currentUser) {
    return (
      <div className='flex flex-wrap items-center justify-end gap-3 text-sm'>
        <Link href={PAGES.PROFILE(currentUser.username)}>
          <SurfaceCard className='rounded-full bg-white/4 px-4 py-2 text-white/75 transition hover:bg-white/8'>
            <span className='font-semibold text-white'>{currentUser.name}</span>
            <span className='ml-2 text-white/45'>@{currentUser.username}</span>
          </SurfaceCard>
        </Link>
        <form action={logoutAction}>
          <button
            type='submit'
            className='rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/15 hover:cursor-pointer'
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  const database = await readDemoDatabase();

  return (
    <div className='flex flex-wrap items-center justify-end gap-2'>
      <span className='rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-100'>
        Demo mode
      </span>
      <DemoRolePicker users={database.users} />
      {database.users.map((user) => (
        <form key={user.id} action={loginAction}>
          <input type='hidden' name='userId' value={user.id} />
          <button
            type='submit'
            className='rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-2 text-sm text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-400/15 hover:cursor-pointer'
          >
            Sign in as {user.name}
          </button>
        </form>
      ))}
    </div>
  );
};
