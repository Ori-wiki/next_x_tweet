import { ProductCard, type Product } from '@/app/components/ProductCard';
import { PRODUCTS_API_URL } from '@/app/constants';

export default async function ShopISRPage() {
  const response = await fetch(PRODUCTS_API_URL, { next: { revalidate: 300 } });
  const products = (await response.json()) as Product[];

  return (
    <section className='space-y-4'>
      <div className='rounded-3xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100'>
        ISR route: the page is revalidated in the background every 5 minutes.
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
