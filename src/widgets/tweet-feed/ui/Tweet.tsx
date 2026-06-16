import Image from 'next/image';
import Link from 'next/link';
import { CopyLinkButton } from '@/shared/ui/CopyLinkButton';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { TweetMediaCard, type TweetView } from '@/entities/tweet';
import { DeleteTweetButton } from './DeleteTweetButton';
import { ReplyModal } from './ReplyModal';
import { TweetActionButton } from './TweetActionButton';
import { PAGES } from '@/shared/config/pages';
import { deleteTweetAction, restoreTweetAction } from '@/features/delete-tweet';
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
  'mx-1 inline-flex min-h-11 w-[calc(100%-0.5rem)] min-w-0 cursor-pointer items-center justify-center gap-1 rounded-full border border-transparent bg-transparent px-1 py-2 text-xs font-medium text-(--color-text-secondary) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:mx-0 sm:min-h-0 sm:w-auto sm:min-w-27 sm:gap-2 sm:border-(--color-border) sm:px-4 sm:text-sm';

const likedActionClassName =
  '!border-(--color-neutral-border) !bg-(--color-neutral-surface) !text-(--color-neutral-text) hover:!border-(--color-neutral-border-hover) hover:!bg-(--color-neutral-surface-hover)';

const bookmarkedActionClassName =
  '!border-(--color-teal-border) !bg-(--color-teal-surface) !text-(--color-teal-text) hover:!border-(--color-teal-border-hover) hover:!bg-(--color-teal-surface-hover)';

const repostedActionClassName =
  '!border-(--color-warning-border-strong) !bg-(--color-warning-surface-strong) !text-(--color-warning-text) hover:!border-(--color-warning-border-hover) hover:!bg-(--color-warning-surface-hover)';

const deleteActionClassName =
  'border-(--color-border) bg-transparent text-(--color-text-muted) hover:border-(--color-danger-border-hover) hover:bg-(--color-danger-surface-hover) hover:text-(--color-danger-text)';

export const Tweet = ({ tweet, canInteract, language }: TweetProps) => {
  const { common, thread, tweet: tweetText, tweetForm } = getDictionary(language);
  const actions = [
    {
      action: toggleLikeAction,
      active: tweet.isLiked,
      activeClassName: likedActionClassName,
      activeLabel: tweetText.unlike,
      count: tweet.likes,
      inactiveLabel: tweetText.like,
      kind: 'like' as const,
      toastLabel: tweet.isLiked ? tweetText.likeRemovedToast : tweetText.likedToast,
    },
    {
      action: toggleBookmarkAction,
      active: tweet.isBookmarked,
      activeClassName: bookmarkedActionClassName,
      activeLabel: tweetText.bookmarked,
      count: tweet.bookmarks,
      inactiveLabel: tweetText.bookmark,
      kind: 'bookmark' as const,
      toastLabel: tweet.isBookmarked
        ? tweetText.bookmarkRemovedToast
        : tweetText.bookmarkedToast,
      toastAction: tweet.isBookmarked
        ? undefined
        : {
            href: PAGES.BOOKMARKS,
            label: tweetText.openBookmarks,
          },
    },
    {
      action: toggleRepostAction,
      active: tweet.isReposted,
      activeClassName: repostedActionClassName,
      activeLabel: tweetText.reposted,
      count: tweet.reposts,
      inactiveLabel: tweetText.repost,
      kind: 'repost' as const,
      toastLabel: tweet.isReposted
        ? tweetText.repostRemovedToast
        : tweetText.repostedToast,
    },
  ];
  const metrics = [
    `${formatNumber(tweet.views, language)} ${tweetText.views}`,
    `${tweet.repliesCount} ${tweetText.replies}`,
    `${tweet.reposts} ${tweetText.reposts}`,
  ];

  return (
    <SurfaceCard className='p-3.5 shadow-(--shadow-card) sm:p-5'>
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

      <div className='mb-3 flex items-start justify-between gap-3 sm:gap-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <UserAvatar
            src={tweet.author.avatar}
            alt={`${tweet.author.name} avatar`}
            sizes='44px'
            className='size-10 sm:size-11'
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
        <Image
          src='/XTwitterW.svg'
          width={22}
          height={22}
          alt=''
          className='opacity-70'
        />
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

      <div className='mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-(--color-text-subtle) sm:mb-4 sm:text-sm'>
        {metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>

      <div className='grid grid-cols-5 items-center gap-0 text-sm text-(--color-text-secondary) sm:flex sm:flex-wrap sm:gap-3'>
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
            toastAction={item.toastAction}
            toastLabel={item.toastLabel}
            tweetId={tweet.id}
          />
        ))}
        <ReplyModal
          buttonClassName='mx-1 inline-flex min-h-11 w-[calc(100%-0.5rem)] min-w-0 items-center justify-center gap-1 rounded-full border border-transparent bg-transparent px-1 py-2 text-center text-xs font-medium text-(--color-text-secondary) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:mx-0 sm:min-h-0 sm:w-auto sm:min-w-27 sm:gap-2 sm:border-(--color-border) sm:px-4 sm:text-sm'
          canInteract={canInteract}
          language={language}
          texts={{
            attachmentLabelPlaceholder: tweetForm.attachmentLabel,
            close: common.close,
            mediaUrlPlaceholder: tweetForm.mediaUrl,
            openThread: thread.openThread,
            pendingLabel: tweetForm.posting,
            placeholder: tweetForm.placeholder,
            replyPreviewTitle: tweetForm.replyPreviewTitle,
            replies: tweetText.replies,
            replyTitle: tweetForm.replyToThread,
            signInToReply: thread.signInToReply,
            submitLabel: tweetForm.postReply,
            thread: tweetText.thread,
            views: tweetText.views,
          }}
          tweet={tweet}
        />

        <CopyLinkButton
          url={PAGES.TWEET(tweet.id)}
          label={tweetText.copyLink}
          copiedLabel={tweetText.copied}
        />

        {tweet.isOwn ? (
          <DeleteTweetButton
            action={deleteTweetAction}
            baseClassName={tweetActionClassName}
            className={deleteActionClassName}
            deletedLabel={tweetText.deletedToast}
            restoredLabel={tweetText.deleteRestoredToast}
            idleLabel={tweetText.delete}
            pendingLabel={tweetText.deleting}
            restoreAction={restoreTweetAction}
            tweetId={tweet.id}
            undoLabel={tweetText.undoDelete}
          />
        ) : null}

        {!canInteract ? (
          <p className='col-span-5 mt-2 text-center text-xs text-(--color-text-subtle) sm:text-left sm:text-sm'>
            {tweetText.signInHint}
          </p>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
