import Link from 'next/link';
import { PROFILE_TABS, type ProfileTabKey } from '@/app/config/profile.config';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { StatCard } from '@/app/components/StatCard';
import { TweetList } from '@/app/components/TweetList';
import { toggleFollowAction } from '@/app/server-actions/post-tweet';
import { formatMessage, getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getUserProfile } from '@/app/shared/lib/tweets';
import type { SessionUser } from '@/app/shared/types/user.interface';

interface ProfileProps {
  username: string;
  currentUser: SessionUser | null;
  tab?: ProfileTabKey;
}

export const Profile = async ({ username, currentUser, tab }: ProfileProps) => {
  const language = resolveLanguage(currentUser?.settings);
  const { profile: profileText } = getDictionary(language);
  const { profile, tabs: profileTabs, relatedUsers, isFollowing } =
    await getUserProfile(username, currentUser);
  const activeTab: ProfileTabKey =
    tab && PROFILE_TABS.some((item) => item.key === tab) ? tab : 'posts';
  const activeTweets = profileTabs[activeTab];
  const stats = [
    { label: profileText.posts.toLowerCase(), value: profileTabs.posts.length },
    { label: profileText.followers, value: profile.followers },
    { label: profileText.following, value: profile.following },
  ];
  const tabLabels: Record<ProfileTabKey, string> = {
    posts: profileText.posts,
    likes: profileText.likes,
    media: profileText.media,
  };
  const canManageSettings = currentUser?.id === profile.id;

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
              <div className='mt-3 flex flex-wrap gap-2'>
                {profile.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/explore?q=${topic}`}
                    className='rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/70 transition hover:border-sky-300/35 hover:text-white'
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex gap-3 text-sm text-white/75'>
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
            {currentUser && currentUser.id !== profile.id ? (
              <form action={toggleFollowAction}>
                <input type='hidden' name='targetUserId' value={profile.id} />
                <button
                  type='submit'
                  className='rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:cursor-pointer hover:bg-slate-200'
                >
                  {isFollowing ? profileText.followingState : profileText.follow}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </section>

      <div className='sticky top-[124px] z-10 rounded-3xl border border-white/10 bg-slate-950/75 p-2 backdrop-blur'>
        <div className='flex flex-wrap gap-2'>
          {PROFILE_TABS.map((item) => {
            const isActive = item.key === activeTab;

            return (
              <Link
                key={item.key}
                href={`/u/${profile.username}?tab=${item.key}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-400 text-black'
                    : 'text-white/65 hover:bg-white/6 hover:text-white'
                }`}
              >
                {tabLabels[item.key]}
              </Link>
            );
          })}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
        <TweetList
          tweets={activeTweets}
          canInteract={Boolean(currentUser)}
          emptyMessage={formatMessage(profileText.noItemsYet, {
            tab: tabLabels[activeTab].toLowerCase(),
          })}
          language={language}
        />

        <aside className='space-y-4'>
          {canManageSettings ? (
            <SettingsPanel settings={currentUser.settings} />
          ) : null}

          <SurfaceCard className='p-5'>
            <h2 className='text-lg font-semibold text-white'>
              {profileText.similarProfiles}
            </h2>
            <div className='mt-4 space-y-3'>
              {relatedUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className='block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-sky-300/35 hover:bg-sky-400/8'
                >
                  <p className='font-medium text-white'>{user.name}</p>
                  <p className='text-sm text-sky-200'>@{user.username}</p>
                  <p className='mt-2 text-sm text-white/55'>
                    {user.sharedTopics.join(' · ') || user.topics.slice(0, 2).join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          </SurfaceCard>
        </aside>
      </div>
    </div>
  );
};
