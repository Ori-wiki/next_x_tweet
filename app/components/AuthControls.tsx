import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { logoutAction } from '@/app/server-actions/post-tweet';
import { getSessionUser } from '@/app/shared/lib/auth';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { DemoRolePicker } from './DemoRolePicker';
import { SurfaceCard } from './SurfaceCard';

export const AuthControls = async () => {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { auth, common } = getDictionary(language);

  if (currentUser) {
    return (
      <div className='flex flex-wrap items-center justify-end gap-3 text-sm'>
        <Link
          href={PAGES.PROFILE(currentUser.username)}
          aria-label={`${currentUser.name} @${currentUser.username}`}
        >
          <SurfaceCard className='rounded-full bg-white/4 px-3 py-2 text-white/75 transition hover:bg-white/8 hover:border-sky-300/25'>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-black'>
                {currentUser.avatar}
              </div>
              <div className='min-w-0 leading-tight'>
                <p className='truncate font-semibold text-white'>{currentUser.name}</p>
                <p className='truncate text-xs text-white/45'>@{currentUser.username}</p>
              </div>
              <span className='text-base text-white/35' aria-hidden='true'>
                &gt;
              </span>
            </div>
          </SurfaceCard>
        </Link>
        <form action={logoutAction}>
          <button
            type='submit'
            className='rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white transition hover:bg-white/15 hover:cursor-pointer'
          >
            {auth.signOut}
          </button>
        </form>
      </div>
    );
  }

  const database = await readDemoDatabase();

  return (
    <div className='flex flex-wrap items-center justify-end gap-2'>
      <span className='rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-100'>
        {common.demoMode}
      </span>
      <DemoRolePicker users={database.users} language={language} />
    </div>
  );
};
