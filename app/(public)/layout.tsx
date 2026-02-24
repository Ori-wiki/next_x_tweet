import { PropsWithChildren } from 'react';
import { Header } from '../components/Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen '>
      <Header />
      <div className='w-full max-w-xl flex justify-center px-4 py-8'>
        {children}
      </div>
    </div>
  );
}
