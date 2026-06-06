import type { Metadata } from 'next';
import { getSessionUser } from '@/entities/user';
import { getUserProfile } from '@/entities/tweet';
import type { ProfileTabKey } from '@/entities/user';
import { Profile } from './ProfilePage';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: ProfileTabKey }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const { profile } = await getUserProfile(username);

  return {
    title: `${profile.name} (@${profile.username})`,
    description: profile.bio,
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { username } = await params;
  const { tab } = await searchParams;
  const currentUser = await getSessionUser();

  return <Profile username={username} currentUser={currentUser} tab={tab} />;
}
