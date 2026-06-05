import Image from 'next/image';
import Link from 'next/link';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { AuthControls } from './AuthControls';
import { Menu } from '@/src/widgets/navigation/ui/Menu';

export const Header = async () => {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { header } = getDictionary(language);

  return (
    <header className='sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-background-header)] backdrop-blur'>
      <div className='mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto]'>
        <Link className='flex min-w-0 items-center gap-3' href='/'>
          <Image
            src='/XTwitterW.svg'
            width={28}
            height={28}
            alt='X logo'
            priority
          />
          <div className='min-w-0'>
            <p className='text-xs uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
              {header.demoApp}
            </p>
            <p className='truncate font-semibold leading-5 text-[var(--color-text-primary)]'>
              Next X Tweet
            </p>
          </div>
        </Link>
        <div className='col-span-2 min-w-0 lg:col-span-1 lg:col-start-2'>
          <Menu language={language} />
        </div>
        <div className='col-start-2 row-start-1 shrink-0 lg:col-start-3'>
          <AuthControls />
        </div>
      </div>
    </header>
  );
};
