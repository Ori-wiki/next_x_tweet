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
    <SurfaceCard className='w-full p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-accent-border-soft)] hover:shadow-[var(--shadow-card-hover)]'>
      <Image
        width={240}
        height={160}
        src={image}
        alt={title}
        className='mb-3 h-40 w-full rounded-2xl bg-[var(--color-surface-solid)] object-contain p-4'
      />
      <h2 className='mb-1 line-clamp-2 text-sm font-medium text-[var(--color-text-primary)]'>{title}</h2>
      <p className='text-sm text-[var(--color-text-soft)]'>${price}</p>
    </SurfaceCard>
  );
};
