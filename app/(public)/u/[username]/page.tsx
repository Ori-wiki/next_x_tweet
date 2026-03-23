import type { Metadata } from 'next';
import { Profile } from './Profile';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getUserProfile } from '@/app/shared/lib/tweets';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
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

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const currentUser = await getSessionUser();

  return <Profile username={username} currentUser={currentUser} />;
}
