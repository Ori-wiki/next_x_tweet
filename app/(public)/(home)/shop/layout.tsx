import { PropsWithChildren } from 'react';
import { ShopMenu } from './ShopMenu';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold mb-6'>Shop</h1>
      <ShopMenu />
      {children}
    </div>
  );
}
