import React from 'react';
import Image from 'next/image';

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

export const ProductCard = ({ title, image, price }: Product) => {
  return (
    <div
      className='w-full border border-black/10 rounded-xl p-4 transition hover:shadow dark:border-white/10'
    >
      <Image
        width={240}
        height={160}
        src={image}
        alt={title}
        className='mb-3 h-40 w-full rounded object-contain'
      />
      <h2
        className='mb-1 line-clamp-2 text-sm font-medium text-black dark:text-white'
      >
        {title}
      </h2>
      <p className='text-sm text-gray-500 dark:text-gray-400'>${price}</p>
    </div>
  );
};
