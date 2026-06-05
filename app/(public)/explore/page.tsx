import type { Metadata } from 'next';
import { Explore } from './Explore';
import { getSessionUser } from '@/src/entities/user/model/session';

export const metadata: Metadata = {
  title: 'Explore',
};

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    sort?: 'latest' | 'top';
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const currentUser = await getSessionUser();

  return (
    <Explore
      currentUser={currentUser}
      q={params.q}
      tag={params.tag}
      sort={params.sort}
    />
  );
}
