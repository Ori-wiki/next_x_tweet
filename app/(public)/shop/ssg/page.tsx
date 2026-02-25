import { ProductCard, type Product } from '@/app/components/ProductCard';
import { API_URL } from '@/app/constats';

export default async function ShopSSGPage() {
  const response = await fetch(API_URL);
  const products = (await response.json()) as Product[];

  return (
    <div className='grid grid-cols-2 gap-4'>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
