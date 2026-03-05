import { ProductCard, type Product } from '@/app/components/ProductCard';
import { API_URL } from '@/app/constats';

export default async function ShopPage() {
  const response = await fetch(API_URL, { cache: 'no-store' });
  const products = (await response.json()) as Product[];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
