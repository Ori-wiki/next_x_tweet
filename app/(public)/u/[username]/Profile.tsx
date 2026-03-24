import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetList } from '@/app/components/TweetList';
import { getUserProfile } from '@/app/shared/lib/tweets';
import type { SessionUser } from '@/app/shared/types/user.interface';

interface ProfileProps {
  username: string;
  currentUser: SessionUser | null;
}

export const Profile = async ({ username, currentUser }: ProfileProps) => {
  const { profile, tweets } = await getUserProfile(username, currentUser);

  return (
    <div className='space-y-6'>
      <section className='rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_45%),rgba(255,255,255,0.03)] p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex h-18 w-18 items-center justify-center rounded-full bg-white text-xl font-semibold text-black'>
              {profile.avatar}
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white'>{profile.name}</h1>
              <p className='text-sky-200'>@{profile.username}</p>
              <p className='mt-3 max-w-2xl text-white/75'>{profile.bio}</p>
            </div>
          </div>
          <div className='flex gap-3 text-sm text-white/75'>
            <SurfaceCard className='rounded-2xl bg-black/20 px-4 py-3'>
              <p className='font-semibold text-white'>{tweets.length}</p>
              <p>posts</p>
            </SurfaceCard>
            <SurfaceCard className='rounded-2xl bg-black/20 px-4 py-3'>
              <p className='font-semibold text-white'>{profile.followers}</p>
              <p>followers</p>
            </SurfaceCard>
            <SurfaceCard className='rounded-2xl bg-black/20 px-4 py-3'>
              <p className='font-semibold text-white'>{profile.following}</p>
              <p>following</p>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <TweetList
        title='Tweets'
        tweets={tweets}
        canInteract={Boolean(currentUser)}
        emptyMessage='This profile has not posted any tweets yet.'
      />
    </div>
  );
};
