import { ProductCard, type Product } from '@/app/components/ProductCard';
import { PRODUCTS_API_URL } from '@/app/constants';

export default async function ShopSSGPage() {
  const response = await fetch(PRODUCTS_API_URL, { cache: 'force-cache' });
  const products = (await response.json()) as Product[];

  return (
    <section className='space-y-4'>
      <div className='rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100'>
        SSG route: page is cached and optimized for fast repeated reads.
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
