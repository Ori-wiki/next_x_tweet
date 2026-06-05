import { PropsWithChildren } from 'react';
import { Header } from '@/src/widgets/header/ui/Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen text-[var(--color-text-primary)]'>
      <Header />
      <div className='mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8'>
        {children}
      </div>
    </div>
  );
}
