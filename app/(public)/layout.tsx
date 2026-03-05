import { PropsWithChildren } from 'react';
import { Header } from '../components/Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-6'>
        {children}
      </div>
    </div>
  );
}
