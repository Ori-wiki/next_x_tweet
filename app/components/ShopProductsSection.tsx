import type { ReactNode } from 'react';
import { InfoBanner } from '@/app/components/InfoBanner';
import { ProductCard, type Product } from '@/app/components/ProductCard';

interface ShopProductsSectionProps {
  products: Product[];
  tone: 'sky' | 'emerald' | 'amber';
  message: ReactNode;
}

export const ShopProductsSection = ({
  products,
  tone,
  message,
}: ShopProductsSectionProps) => {
  return (
    <section className='space-y-4'>
      <InfoBanner tone={tone}>{message}</InfoBanner>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};
