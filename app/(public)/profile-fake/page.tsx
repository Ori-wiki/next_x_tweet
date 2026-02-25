import { Metadata } from 'next';
import { ProfileFake } from './ProfileFake';

export const metadata: Metadata = {
  title: 'Profile Fake',
};

export default function ProfileFakePage() {
  return <ProfileFake />;
}
