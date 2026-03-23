import { Metadata } from 'next';
import { ProfileFake } from './ProfileFake';

export const metadata: Metadata = {
  title: 'Private Dashboard',
};

export default function ProfileFakePage() {
  return <ProfileFake />;
}
