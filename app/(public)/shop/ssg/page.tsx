import { ShopProductsSection } from '@/app/components/ShopProductsSection';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getProducts } from '@/app/shared/lib/products';

export default async function ShopSSGPage() {
  const currentUser = await getSessionUser();
  const { shop } = getDictionary(resolveLanguage(currentUser?.settings));
  const products = await getProducts({ cache: 'force-cache' });

  return (
    <ShopProductsSection
      products={products}
      tone='emerald'
      message={shop.ssgMessage}
    />
  );
}
