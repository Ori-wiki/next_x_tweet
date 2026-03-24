import { ShopProductsSection } from '@/app/components/ShopProductsSection';
import { getProducts } from '@/app/shared/lib/products';

export default async function ShopSSGPage() {
  const products = await getProducts({ cache: 'force-cache' });

  return (
    <ShopProductsSection
      products={products}
      tone='emerald'
      message='SSG route: the page is cached ahead of time for fast repeated reads.'
    />
  );
}
