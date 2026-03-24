import { ShopProductsSection } from '@/app/components/ShopProductsSection';
import { getProducts } from '@/app/shared/lib/products';

export default async function ShopISRPage() {
  const products = await getProducts({ next: { revalidate: 300 } });

  return (
    <ShopProductsSection
      products={products}
      tone='amber'
      message='ISR route: the page is revalidated in the background every 5 minutes.'
    />
  );
}
