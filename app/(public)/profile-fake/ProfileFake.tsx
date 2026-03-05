import dynamic from 'next/dynamic';

const DynamicProfileButton = dynamic(() =>
  import('./ProfileButton').then((mod) => mod.ProfileButton),
);

export const ProfileFake = () => {
  return (
    <div className='flex w-full flex-col items-center'>
      <h1 className='mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl'>
        Profile Fake
      </h1>
      <DynamicProfileButton />
    </div>
  );
};
