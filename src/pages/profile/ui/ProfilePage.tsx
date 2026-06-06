import Link from 'next/link';
import {
  PROFILE_TABS,
  type ProfileTabKey,
} from '@/entities/user';
import { UserAvatar } from '@/entities/user/ui';
import { SettingsPanel } from '@/features/update-settings';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { StatCard } from '@/shared/ui/StatCard';
import { TweetList } from '@/widgets/tweet-feed';
import { toggleFollowAction } from '@/features/follow-user';
import { PAGES } from '@/shared/config/pages';
import {
  formatMessage,
  getDictionary,
  resolveLanguage,
} from '@/shared/lib/i18n';
import { getUserProfile } from '@/entities/tweet';
import type { SessionUser } from '@/entities/user';

export interface ProfilePageViewProps {
  username: string;
  currentUser: SessionUser | null;
  tab?: ProfileTabKey;
}

export default async function ProfilePageView({
  username,
  currentUser,
  tab,
}: ProfilePageViewProps) {
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
      <section className='rounded-3xl border border-(--color-border) bg-(--color-surface) p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
          <div className='flex items-start gap-4'>
            <UserAvatar
              src={profile.avatar}
              alt={`${profile.name} avatar`}
              sizes='72px'
              className='size-18'
            />
            <div>
              <h1 className='text-3xl font-bold text-(--color-text-primary)'>{profile.name}</h1>
              <p className='text-(--color-accent-text)'>@{profile.username}</p>
              <p className='mt-3 max-w-2xl text-(--color-text-secondary)'>{profile.bio}</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {profile.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={PAGES.EXPLORE_WITH({ q: topic })}
                    className='rounded-full border border-(--color-border) bg-(--color-surface-dark) px-3 py-1 text-sm text-(--color-text-secondary) transition hover:border-(--color-accent-border-soft) hover:text-(--color-text-primary)'
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex gap-3 text-sm text-(--color-text-secondary)'>
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
                  className='rounded-full bg-(--color-surface-solid) px-5 py-2 text-sm font-semibold text-(--color-text-inverse) transition hover:cursor-pointer hover:bg-(--color-foreground)'
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

      <div>
        <div className='rounded-3xl border border-(--color-border) bg-(--color-background) p-2 shadow-(--shadow-card)'>
          <div className='flex flex-wrap gap-2'>
            {PROFILE_TABS.map((item) => {
              const isActive = item.key === activeTab;

              return (
                <Link
                  key={item.key}
                  href={PAGES.PROFILE_TAB(profile.username, item.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-(--color-accent) text-(--color-text-inverse)'
                      : 'text-(--color-text-muted) hover:bg-(--color-surface) hover:text-(--color-text-primary)'
                  }`}
                >
                  {tabLabels[item.key]}
                </Link>
              );
            })}
          </div>
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
            <h2 className='text-lg font-semibold text-(--color-text-primary)'>
              {profileText.similarProfiles}
            </h2>
            <div className='mt-4 space-y-3'>
              {relatedUsers.map((user) => (
                <Link
                  key={user.id}
                  href={PAGES.PROFILE(user.username)}
                  className='block rounded-2xl border border-(--color-border) bg-(--color-surface-dark) px-4 py-3 transition hover:border-(--color-accent-border-soft) hover:bg-(--color-accent-surface)'
                >
                  <p className='font-medium text-(--color-text-primary)'>{user.name}</p>
                  <p className='text-sm text-(--color-accent-text)'>@{user.username}</p>
                  <p className='mt-2 text-sm text-(--color-text-soft)'>
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
}
