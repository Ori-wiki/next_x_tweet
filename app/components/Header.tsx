import Link from 'next/link';
import Image from 'next/image';
import { Menu } from './Menu';

export const Header = () => {
  return (
    <header
      className='border-b border-white/10 bg-black'
    >
      <div className='mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4'>
        <Link className='flex items-center gap-3' href='/'>
          <Image
            src='/XTwitterW.svg'
            width={28}
            height={28}
            alt='X logo'
            priority
          />
        </Link>
        <Menu />
      </div>
    </header>
  );
};
