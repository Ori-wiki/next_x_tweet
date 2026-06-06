import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Trash2 } from 'lucide-react';
import { CopyLinkButton } from '@/shared/ui/CopyLinkButton';
import { SubmitButton } from '@/shared/ui/SubmitButton';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { TweetMediaCard, type TweetView } from '@/entities/tweet';
import { TweetActionButton } from './TweetActionButton';
import { PAGES } from '@/shared/config/pages';
import { deleteTweetAction } from '@/features/delete-tweet';
import {
  toggleBookmarkAction,
  toggleLikeAction,
  toggleRepostAction,
} from '@/features/toggle-tweet-reaction';
import { getDictionary } from '@/shared/lib/i18n';
import { formatDateTime, formatNumber } from '@/shared/lib/utils';
import type { UserLanguage } from '@/entities/user';
import { UserAvatar } from '@/entities/user/ui';

interface TweetProps {
  tweet: TweetView;
  canInteract: boolean;
  language?: UserLanguage;
}

const tweetActionClassName =
  'inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-(--color-border) bg-transparent px-2 py-2 text-xs font-medium text-(--color-text-secondary) backdrop-blur-sm transition hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:w-auto sm:min-w-27 sm:px-4 sm:text-sm';

const likedActionClassName =
  '!border-(--color-neutral-border) !bg-(--color-neutral-surface) !text-(--color-neutral-text) hover:!border-(--color-neutral-border-hover) hover:!bg-(--color-neutral-surface-hover)';

const bookmarkedActionClassName =
  '!border-(--color-teal-border) !bg-(--color-teal-surface) !text-(--color-teal-text) hover:!border-(--color-teal-border-hover) hover:!bg-(--color-teal-surface-hover)';

const repostedActionClassName =
  '!border-(--color-warning-border-strong) !bg-(--color-warning-surface-strong) !text-(--color-warning-text) hover:!border-(--color-warning-border-hover) hover:!bg-(--color-warning-surface-hover)';

const deleteActionClassName =
  'border-(--color-border) bg-transparent text-(--color-text-muted) hover:border-(--color-danger-border-hover) hover:bg-(--color-danger-surface-hover) hover:text-(--color-danger-text)';

export const Tweet = ({ tweet, canInteract, language }: TweetProps) => {
  const { tweet: tweetText } = getDictionary(language);
  const actions = [
    {
      action: toggleLikeAction,
      active: tweet.isLiked,
      activeClassName: likedActionClassName,
      activeLabel: tweetText.unlike,
      count: tweet.likes,
      inactiveLabel: tweetText.like,
      kind: 'like' as const,
    },
    {
      action: toggleBookmarkAction,
      active: tweet.isBookmarked,
      activeClassName: bookmarkedActionClassName,
      activeLabel: tweetText.bookmarked,
      count: tweet.bookmarks,
      inactiveLabel: tweetText.bookmark,
      kind: 'bookmark' as const,
    },
    {
      action: toggleRepostAction,
      active: tweet.isReposted,
      activeClassName: repostedActionClassName,
      activeLabel: tweetText.reposted,
      count: tweet.reposts,
      inactiveLabel: tweetText.repost,
      kind: 'repost' as const,
    },
  ];
  const metrics = [
    `${formatNumber(tweet.views, language)} ${tweetText.views}`,
    `${tweet.repliesCount} ${tweetText.replies}`,
    `${tweet.reposts} ${tweetText.reposts}`,
  ];

  return (
    <SurfaceCard className='p-4 shadow-(--shadow-card) sm:p-5'>
      {tweet.replyTo ? (
        <p className='mb-3 text-sm text-(--color-text-subtle)'>
          {tweetText.replyingTo}{' '}
          <Link
            href={PAGES.PROFILE(tweet.replyTo.username)}
            className='text-(--color-accent) transition hover:text-(--color-accent-text)'
          >
            @{tweet.replyTo.username}
          </Link>
        </p>
      ) : null}

      <div className='mb-3 flex items-start justify-between gap-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <UserAvatar
            src={tweet.author.avatar}
            alt={`${tweet.author.name} avatar`}
            sizes='44px'
            className='size-11'
          />
          <div className='min-w-0'>
            <div className='flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5'>
              <p className='font-semibold text-(--color-text-primary)'>
                {tweet.author.name}
              </p>
              <span className='text-sm text-(--color-text-subtle)'>·</span>
              <p className='text-sm text-(--color-text-soft)'>
                {formatDateTime(tweet.createdAt, language)}
              </p>
            </div>
            <Link
              href={PAGES.PROFILE(tweet.author.username)}
              className='text-sm text-(--color-accent) transition hover:text-(--color-accent-text)'
            >
              @{tweet.author.username}
            </Link>
          </div>
        </div>
        <Image src='/XTwitterW.svg' width={24} height={24} alt='X logo' />
      </div>

      <p className='mb-4 whitespace-pre-wrap text-(--color-text-strong)'>
        {tweet.content}
      </p>

      {tweet.media ? (
        <div className='mb-4'>
          <TweetMediaCard media={tweet.media} language={language} />
        </div>
      ) : null}

      {tweet.hashtags.length > 0 ? (
        <div className='mb-4 flex flex-wrap gap-2'>
          {tweet.hashtags.map((hashtag) => (
            <Link
              key={hashtag}
              href={PAGES.EXPLORE_WITH({ tag: hashtag })}
              className='rounded-full border border-(--color-accent-border) bg-(--color-accent-surface) px-3 py-1 text-sm text-(--color-accent-text) transition hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface-hover)'
            >
              #{hashtag}
            </Link>
          ))}
        </div>
      ) : null}

      <div className='mb-4 flex flex-wrap gap-3 text-sm text-(--color-text-subtle)'>
        {metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>

      <div className='grid grid-cols-2 items-center gap-2 text-sm text-(--color-text-secondary) sm:flex sm:flex-wrap sm:gap-3'>
        {actions.map((item) => (
          <TweetActionButton
            key={item.kind}
            action={item.action}
            active={item.active}
            activeClassName={item.activeClassName}
            activeLabel={item.activeLabel}
            baseClassName={`${tweetActionClassName} ${
              !canInteract ? 'pointer-events-none opacity-60' : ''
            }`}
            count={item.count}
            inactiveLabel={item.inactiveLabel}
            kind={item.kind}
            tweetId={tweet.id}
          />
        ))}
        <Link
          href={PAGES.TWEET(tweet.id)}
          className='inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-(--color-border) bg-transparent px-2 py-2 text-center text-xs font-medium text-(--color-text-secondary) backdrop-blur-sm transition hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:w-auto sm:min-w-27 sm:px-4 sm:text-sm'
        >
          <MessageCircle aria-hidden='true' size={16} />
          <span className='min-w-0 truncate'>{tweetText.thread}</span>
        </Link>

        <CopyLinkButton
          url={PAGES.TWEET(tweet.id)}
          label={tweetText.copyLink}
          copiedLabel={tweetText.copied}
        />

        {tweet.isOwn ? (
          <form action={deleteTweetAction}>
            <input type='hidden' name='tweetId' value={tweet.id} />
            <SubmitButton
              idleLabel={
                <>
                  <Trash2 aria-hidden='true' size={16} />
                  <span>{tweetText.delete}</span>
                </>
              }
              pendingLabel={tweetText.deleting}
              className={`${tweetActionClassName} ${deleteActionClassName}`}
            />
          </form>
        ) : null}

        {!canInteract ? (
          <p className='text-sm text-(--color-text-subtle)'>
            {tweetText.signInHint}
          </p>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
