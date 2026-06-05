import Link from 'next/link';
import { PAGES } from '@/src/shared/config/pages';
import { logoutAction } from '@/src/features/auth/model/actions';
import { getSessionUser } from '@/src/entities/user/model/session';
import { readDemoDatabase } from '@/src/shared/lib/demo-db';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { DemoRolePicker } from '@/src/features/auth/ui/DemoRolePicker';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';

const headerButtonBaseClassName =
  'rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] transition hover:cursor-pointer';
const profileButtonClassName =
  'bg-[var(--color-surface)] px-2 py-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-accent-border)] sm:px-3 sm:py-2';
const signOutButtonClassName =
  `${headerButtonBaseClassName} bg-[var(--color-surface-raised)] px-3 py-2 text-xs hover:bg-[var(--color-surface-hover)] sm:px-4 sm:py-[0.8125rem] sm:text-sm`;

export const AuthControls = async () => {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { auth, common } = getDictionary(language);

  if (currentUser) {
    return (
      <div className='flex items-center justify-end gap-2 text-sm'>
        <Link
          href={PAGES.PROFILE(currentUser.username)}
          aria-label={`${currentUser.name} @${currentUser.username}`}
        >
          <SurfaceCard className={`${headerButtonBaseClassName} ${profileButtonClassName}`}>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-xs font-semibold text-[var(--color-text-inverse)]'>
                {currentUser.avatar}
              </div>
              <p className='hidden max-w-32 truncate font-semibold text-[var(--color-text-primary)] sm:block'>{currentUser.name}</p>
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
      <span className='rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-surface)] px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-warning-text)]'>
        {common.demoMode}
      </span>
      <DemoRolePicker users={database.users} language={language} />
    </div>
  );
};
