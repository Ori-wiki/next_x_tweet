import Image from 'next/image';
import { SurfaceCard } from '@/app/components/SurfaceCard';

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

export const ProductCard = ({ title, image, price }: Product) => {
  return (
    <SurfaceCard className='w-full p-4 transition hover:-translate-y-0.5 hover:border-sky-300/30 hover:shadow-[0_24px_80px_rgba(0,0,0,0.2)]'>
      <Image
        width={240}
        height={160}
        src={image}
        alt={title}
        className='mb-3 h-40 w-full rounded-2xl bg-white object-contain p-4'
      />
      <h2 className='mb-1 line-clamp-2 text-sm font-medium text-white'>{title}</h2>
      <p className='text-sm text-white/60'>${price}</p>
    </SurfaceCard>
  );
};
