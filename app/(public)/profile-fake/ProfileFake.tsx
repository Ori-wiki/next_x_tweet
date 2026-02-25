import dynamic from 'next/dynamic';

const DynamicProfileButton = dynamic(() =>
  import('./ProfileButton').then((mod) => mod.ProfileButton),
);

export const ProfileFake = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-6'>Profile Fake</h1>
      <DynamicProfileButton />
    </div>
  );
};
