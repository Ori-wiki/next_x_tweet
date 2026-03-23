import Image from 'next/image';
import Link from 'next/link';
import { AuthControls } from './AuthControls';
import { Menu } from './Menu';

export const Header = () => {
  return (
    <header className='sticky top-0 z-20 border-b border-white/10 bg-[#020617]/90 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-3 sm:px-6 sm:py-4'>
        <div className='flex items-center justify-between gap-4'>
          <Link className='flex items-center gap-3' href='/'>
            <Image
              src='/XTwitterW.svg'
              width={28}
              height={28}
              alt='X logo'
              priority
            />
            <div>
              <p className='text-sm uppercase tracking-[0.25em] text-white/45'>
                Demo App
              </p>
              <p className='font-semibold text-white'>Next X Tweet</p>
            </div>
          </Link>
          <AuthControls />
        </div>
        <Menu />
      </div>
    </header>
  );
};
