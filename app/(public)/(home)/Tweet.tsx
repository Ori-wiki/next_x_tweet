import Image from 'next/image';
import Link from 'next/link';
import { CopyLinkButton } from '@/app/components/CopyLinkButton';
import { SubmitButton } from '@/app/components/SubmitButton';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { TweetMediaCard } from '@/app/components/TweetMediaCard';
import { PAGES } from '@/app/config/pages.config';
import {
  deleteTweetAction,
  toggleBookmarkAction,
  toggleLikeAction,
  toggleRepostAction,
} from '@/app/server-actions/post-tweet';
import { formatRelativeDate } from '@/app/shared/lib/utils';
import type { TweetView } from '@/app/shared/types/tweet.interface';

interface TweetProps {
  tweet: TweetView;
  canInteract: boolean;
}

const tweetActionClassName =
  'min-w-[108px] rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-sm transition hover:border-white/18 hover:bg-white/[0.04] hover:text-white';

const likedActionClassName =
  '!border-slate-300/35 !bg-slate-200/18 !text-slate-100 hover:!border-slate-300/45 hover:!bg-slate-200/24';

const bookmarkedActionClassName =
  '!border-teal-300/35 !bg-teal-300/16 !text-teal-50 hover:!border-teal-300/45 hover:!bg-teal-300/22';

const repostedActionClassName =
  '!border-amber-300/35 !bg-amber-300/16 !text-amber-50 hover:!border-amber-300/45 hover:!bg-amber-300/22';

const deleteActionClassName =
  'border-white/10 bg-transparent text-white/68 hover:border-rose-300/24 hover:bg-rose-400/[0.06] hover:text-rose-100';

export const Tweet = ({ tweet, canInteract }: TweetProps) => {
  const actions = [
    {
      action: toggleLikeAction,
      className: tweet.isLiked ? likedActionClassName : '',
      label: `${tweet.isLiked ? 'Unlike' : 'Like'} · ${tweet.likes}`,
    },
    {
      action: toggleBookmarkAction,
      className: tweet.isBookmarked ? bookmarkedActionClassName : '',
      label: `${tweet.isBookmarked ? 'Bookmarked' : 'Bookmark'} · ${tweet.bookmarks}`,
    },
    {
      action: toggleRepostAction,
      className: tweet.isReposted ? repostedActionClassName : '',
      label: `${tweet.isReposted ? 'Reposted' : 'Repost'} · ${tweet.reposts}`,
    },
  ];

  const metrics = [
    `${tweet.views.toLocaleString('en-US')} views`,
    `${tweet.repliesCount} replies`,
    `${tweet.reposts} reposts`,
  ];

  return (
    <SurfaceCard className='p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]'>
      {tweet.replyTo ? (
        <p className='mb-3 text-sm text-white/45'>
          Replying to{' '}
          <Link
            href={PAGES.PROFILE(tweet.replyTo.username)}
            className='text-sky-300 transition hover:text-sky-200'
          >
            @{tweet.replyTo.username}
          </Link>
        </p>
      ) : null}

      <div className='mb-3 flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-black'>
            {tweet.author.avatar}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='font-semibold text-white'>{tweet.author.name}</p>
              <span className='text-sm text-white/40'>·</span>
              <p className='text-sm text-white/55'>
                {formatRelativeDate(tweet.createdAt)}
              </p>
            </div>
            <Link
              href={PAGES.PROFILE(tweet.author.username)}
              className='text-sm text-sky-300 transition hover:text-sky-200'
            >
              @{tweet.author.username}
            </Link>
          </div>
        </div>
        <Image src='/XTwitterW.svg' width={24} height={24} alt='X logo' />
      </div>

      <p className='mb-4 whitespace-pre-wrap text-white/90'>{tweet.content}</p>

      {tweet.media ? (
        <div className='mb-4'>
          <TweetMediaCard media={tweet.media} />
        </div>
      ) : null}

      {tweet.hashtags.length > 0 ? (
        <div className='mb-4 flex flex-wrap gap-2'>
          {tweet.hashtags.map((hashtag) => (
            <Link
              key={hashtag}
              href={`/explore?tag=${hashtag}`}
              className='rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-200 transition hover:border-sky-400/40 hover:bg-sky-400/15'
            >
              #{hashtag}
            </Link>
          ))}
        </div>
      ) : null}

      <div className='mb-4 flex flex-wrap gap-3 text-sm text-white/45'>
        {metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>

      <div className='flex flex-wrap items-center gap-3 text-sm text-white/70'>
        {actions.map((item) => (
          <form key={item.label} action={item.action}>
            <input type='hidden' name='tweetId' value={tweet.id} />
            <SubmitButton
              idleLabel={item.label}
              pendingLabel='...'
              className={`${tweetActionClassName} ${item.className} ${
                !canInteract ? 'pointer-events-none opacity-60' : ''
              }`}
            />
          </form>
        ))}

        <Link
          href={PAGES.TWEET(tweet.id)}
          className='min-w-[108px] rounded-full border border-white/10 bg-transparent px-4 py-2 text-center text-sm font-medium text-white/78 backdrop-blur-sm transition hover:border-white/18 hover:bg-white/[0.04] hover:text-white'
        >
          Thread
        </Link>

        <CopyLinkButton url={PAGES.TWEET(tweet.id)} />

        {tweet.isOwn ? (
          <form action={deleteTweetAction}>
            <input type='hidden' name='tweetId' value={tweet.id} />
            <SubmitButton
              idleLabel='Delete'
              pendingLabel='Deleting...'
              className={`${tweetActionClassName} ${deleteActionClassName}`}
            />
          </form>
        ) : null}

        {!canInteract ? (
          <p className='text-sm text-white/45'>
            Sign in to like tweets, repost them and save bookmarks.
          </p>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
