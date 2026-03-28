import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { logoutAction } from '@/app/server-actions/post-tweet';
import { getSessionUser } from '@/app/shared/lib/auth';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { DemoRolePicker } from './DemoRolePicker';
import { SurfaceCard } from './SurfaceCard';

const headerButtonBaseClassName =
  'rounded-full border border-white/10 text-white transition hover:cursor-pointer';
const profileButtonClassName =
  'bg-white/4 px-3 py-2 text-white/75 hover:bg-white/8 hover:border-sky-300/25';
const signOutButtonClassName =
  `${headerButtonBaseClassName} bg-white/10 px-4 py-[0.8125rem] hover:bg-white/15`;

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
          <SurfaceCard className={`${headerButtonBaseClassName} ${profileButtonClassName}`}>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-black'>
                {currentUser.avatar}
              </div>
              <p className='truncate font-semibold text-white'>{currentUser.name}</p>
            </div>
          </SurfaceCard>
        </Link>
        <form action={logoutAction}>
          <button
            type='submit'
            className={signOutButtonClassName}
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
