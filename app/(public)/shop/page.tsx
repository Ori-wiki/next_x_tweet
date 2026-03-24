import { ShopProductsSection } from '@/app/components/ShopProductsSection';
import { getProducts } from '@/app/shared/lib/products';

export default async function ShopPage() {
  const products = await getProducts({ cache: 'no-store' });

  return (
    <ShopProductsSection
      products={products}
      tone='sky'
      message={
        <>
        SSR route: every request fetches fresh data from the API with
        <code> cache: &quot;no-store&quot;</code>.
        </>
      }
    />
  );
}
