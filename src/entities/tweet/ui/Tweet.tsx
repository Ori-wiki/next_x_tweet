import Image from 'next/image';
import Link from 'next/link';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Trash2,
} from 'lucide-react';
import { CopyLinkButton } from '@/src/shared/ui/CopyLinkButton';
import { SubmitButton } from '@/src/shared/ui/SubmitButton';
import { SurfaceCard } from '@/src/shared/ui/SurfaceCard';
import { TweetMediaCard } from '@/src/entities/tweet/ui/TweetMediaCard';
import { PAGES } from '@/src/shared/config/pages';
import { deleteTweetAction } from '@/src/features/delete-tweet/model/actions';
import {
  toggleBookmarkAction,
  toggleLikeAction,
  toggleRepostAction,
} from '@/src/features/toggle-tweet-reaction/model/actions';
import { getDictionary } from '@/src/shared/lib/i18n';
import { formatRelativeDate } from '@/src/shared/lib/utils';
import type { TweetView } from '@/src/entities/tweet/model/types';
import type { UserLanguage } from '@/src/entities/user/model/types';

interface TweetProps {
  tweet: TweetView;
  canInteract: boolean;
  language?: UserLanguage;
}

const tweetActionClassName =
  'inline-flex min-w-[108px] items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] backdrop-blur-sm transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]';

const likedActionClassName =
  '!border-[var(--color-neutral-border)] !bg-[var(--color-neutral-surface)] !text-[var(--color-neutral-text)] hover:!border-[var(--color-neutral-border-hover)] hover:!bg-[var(--color-neutral-surface-hover)]';

const bookmarkedActionClassName =
  '!border-[var(--color-teal-border)] !bg-[var(--color-teal-surface)] !text-[var(--color-teal-text)] hover:!border-[var(--color-teal-border-hover)] hover:!bg-[var(--color-teal-surface-hover)]';

const repostedActionClassName =
  '!border-[var(--color-warning-border-strong)] !bg-[var(--color-warning-surface-strong)] !text-[var(--color-warning-text)] hover:!border-[var(--color-warning-border-hover)] hover:!bg-[var(--color-warning-surface-hover)]';

const deleteActionClassName =
  'border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-danger-border-hover)] hover:bg-[var(--color-danger-surface-hover)] hover:text-[var(--color-danger-text)]';

export const Tweet = ({ tweet, canInteract, language }: TweetProps) => {
  const { tweet: tweetText } = getDictionary(language);
  const actions = [
    {
      action: toggleLikeAction,
      className: tweet.isLiked ? likedActionClassName : '',
      Icon: Heart,
      label: `${tweet.isLiked ? tweetText.unlike : tweetText.like} · ${tweet.likes}`,
    },
    {
      action: toggleBookmarkAction,
      className: tweet.isBookmarked ? bookmarkedActionClassName : '',
      Icon: Bookmark,
      label: `${tweet.isBookmarked ? tweetText.bookmarked : tweetText.bookmark} · ${tweet.bookmarks}`,
    },
    {
      action: toggleRepostAction,
      className: tweet.isReposted ? repostedActionClassName : '',
      Icon: Repeat2,
      label: `${tweet.isReposted ? tweetText.reposted : tweetText.repost} · ${tweet.reposts}`,
    },
  ];  const metrics = [
    `${tweet.views.toLocaleString('en-US')} ${tweetText.views}`,
    `${tweet.repliesCount} ${tweetText.replies}`,
    `${tweet.reposts} ${tweetText.reposts}`,
  ];

  return (
    <SurfaceCard className='p-5 shadow-[var(--shadow-card)]'>
      {tweet.replyTo ? (
        <p className='mb-3 text-sm text-[var(--color-text-subtle)]'>
          {tweetText.replyingTo}{' '}
          <Link
            href={PAGES.PROFILE(tweet.replyTo.username)}
            className='text-[var(--color-accent)] transition hover:text-[var(--color-accent-text)]'
          >
            @{tweet.replyTo.username}
          </Link>
        </p>
      ) : null}

      <div className='mb-3 flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-solid)] text-sm font-semibold text-[var(--color-text-inverse)]'>
            {tweet.author.avatar}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='font-semibold text-[var(--color-text-primary)]'>{tweet.author.name}</p>
              <span className='text-sm text-[var(--color-text-subtle)]'>·</span>
              <p className='text-sm text-[var(--color-text-soft)]'>
                {formatRelativeDate(tweet.createdAt)}
              </p>
            </div>
            <Link
              href={PAGES.PROFILE(tweet.author.username)}
              className='text-sm text-[var(--color-accent)] transition hover:text-[var(--color-accent-text)]'
            >
              @{tweet.author.username}
            </Link>
          </div>
        </div>
        <Image src='/XTwitterW.svg' width={24} height={24} alt='X logo' />
      </div>

      <p className='mb-4 whitespace-pre-wrap text-[var(--color-text-strong)]'>{tweet.content}</p>

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
              href={`/explore?tag=${hashtag}`}
              className='rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] px-3 py-1 text-sm text-[var(--color-accent-text)] transition hover:border-[var(--color-accent-border-hover)] hover:bg-[var(--color-accent-surface-hover)]'
            >
              #{hashtag}
            </Link>
          ))}
        </div>
      ) : null}

      <div className='mb-4 flex flex-wrap gap-3 text-sm text-[var(--color-text-subtle)]'>
        {metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>

      <div className='flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]'>
        {actions.map((item) => (
          <form key={item.label} action={item.action}>
            <input type='hidden' name='tweetId' value={tweet.id} />
            <SubmitButton
              idleLabel={
                <>
                  <item.Icon aria-hidden='true' size={16} />
                  <span>{item.label}</span>
                </>
              }
              pendingLabel='...'
              className={`${tweetActionClassName} ${item.className} ${
                !canInteract ? 'pointer-events-none opacity-60' : ''
              }`}
            />
          </form>
        ))}

        <Link
          href={PAGES.TWEET(tweet.id)}
          className='inline-flex min-w-[108px] items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-2 text-center text-sm font-medium text-[var(--color-text-secondary)] backdrop-blur-sm transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
        >
          <MessageCircle aria-hidden='true' size={16} />
          <span>{tweetText.thread}</span>
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
          <p className='text-sm text-[var(--color-text-subtle)]'>{tweetText.signInHint}</p>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
