import { ShopProductsSection } from '@/app/components/ShopProductsSection';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getProducts } from '@/app/shared/lib/products';

export default async function ShopISRPage() {
  const currentUser = await getSessionUser();
  const { shop } = getDictionary(resolveLanguage(currentUser?.settings));
  const products = await getProducts({ next: { revalidate: 300 } });

  return (
    <ShopProductsSection
      products={products}
      tone='amber'
      message={shop.isrMessage}
    />
  );
}
