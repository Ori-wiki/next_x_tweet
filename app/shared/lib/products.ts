import type { Product } from '@/app/components/ProductCard';
import { PRODUCTS_API_URL } from '@/app/constants';

export async function getProducts(
  fetchOptions?: RequestInit & { next?: { revalidate?: number } },
) {
  const response = await fetch(PRODUCTS_API_URL, fetchOptions);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return (await response.json()) as Product[];
}
