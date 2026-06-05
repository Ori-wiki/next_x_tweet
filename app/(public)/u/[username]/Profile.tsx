import Link from 'next/link';
import { PROFILE_TABS, type ProfileTabKey } from '@/src/entities/user/config/profile';
import { SettingsPanel } from '@/src/features/update-settings/ui/SettingsPanel';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';
import { StatCard } from '@/src/shared/ui/StatCard';
import { TweetList } from '@/src/entities/tweet/ui/TweetList';
import { toggleFollowAction } from '@/src/features/follow-user/model/actions';
import {
  formatMessage,
  getDictionary,
  resolveLanguage,
} from '@/src/shared/lib/i18n';
import { getUserProfile } from '@/src/entities/tweet';
import type { SessionUser } from '@/src/entities/user/model/types';

interface ProfileProps {
  username: string;
  currentUser: SessionUser | null;
  tab?: ProfileTabKey;
}

export const Profile = async ({ username, currentUser, tab }: ProfileProps) => {
  const language = resolveLanguage(currentUser?.settings);
  const { profile: profileText } = getDictionary(language);
  const {
    profile,
    tabs: profileTabs,
    relatedUsers,
    isFollowing,
  } = await getUserProfile(username, currentUser);
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
      <section className='rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex h-18 w-18 items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-xl font-semibold text-[var(--color-text-inverse)]'>
              {profile.avatar}
            </div>
            <div>
              <h1 className='text-3xl font-bold text-[var(--color-text-primary)]'>{profile.name}</h1>
              <p className='text-[var(--color-accent-text)]'>@{profile.username}</p>
              <p className='mt-3 max-w-2xl text-[var(--color-text-secondary)]'>{profile.bio}</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {profile.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/explore?q=${topic}`}
                    className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface-dark)] px-3 py-1 text-sm text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-border-soft)] hover:text-[var(--color-text-primary)]'
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex gap-3 text-sm text-[var(--color-text-secondary)]'>
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
            {currentUser && currentUser.id !== profile.id ? (
              <form action={toggleFollowAction}>
                <input type='hidden' name='targetUserId' value={profile.id} />
                <button
                  type='submit'
                  className='rounded-full bg-[var(--color-surface-solid)] px-5 py-2 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:cursor-pointer hover:bg-[var(--color-foreground)]'
                >
                  {isFollowing
                    ? profileText.followingState
                    : profileText.follow}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </section>

      <div className='sticky top-31 z-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-overlay)] p-2 backdrop-blur'>
        <div className='flex flex-wrap gap-2'>
          {PROFILE_TABS.map((item) => {
            const isActive = item.key === activeTab;

            return (
              <Link
                key={item.key}
                href={`/u/${profile.username}?tab=${item.key}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
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
            <h2 className='text-lg font-semibold text-[var(--color-text-primary)]'>
              {profileText.similarProfiles}
            </h2>
            <div className='mt-4 space-y-3'>
              {relatedUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className='block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-3 transition hover:border-[var(--color-accent-border-soft)] hover:bg-[var(--color-accent-surface)]'
                >
                  <p className='font-medium text-[var(--color-text-primary)]'>{user.name}</p>
                  <p className='text-sm text-[var(--color-accent-text)]'>@{user.username}</p>
                  <p className='mt-2 text-sm text-[var(--color-text-soft)]'>
                    {user.sharedTopics.join(' · ') ||
                      user.topics.slice(0, 2).join(' · ')}
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
