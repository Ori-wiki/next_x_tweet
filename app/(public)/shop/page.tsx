import { ProductCard, type Product } from '@/app/components/ProductCard';
import { PRODUCTS_API_URL } from '@/app/constants';

export default async function ShopPage() {
  const response = await fetch(PRODUCTS_API_URL, { cache: 'no-store' });
  const products = (await response.json()) as Product[];

  return (
    <section className='space-y-4'>
      <div className='rounded-3xl border border-sky-300/20 bg-sky-400/10 p-4 text-sm text-sky-100'>
        SSR route: every request fetches fresh data from the API with
        `cache: &quot;no-store&quot;`.
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
