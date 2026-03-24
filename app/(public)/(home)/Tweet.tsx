import Image from 'next/image';
import Link from 'next/link';
import { SubmitButton } from '@/app/components/SubmitButton';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { PAGES } from '@/app/config/pages.config';
import {
  deleteTweetAction,
  toggleBookmarkAction,
  toggleLikeAction,
} from '@/app/server-actions/post-tweet';
import { formatRelativeDate } from '@/app/shared/lib/utils';
import type { TweetView } from '@/app/shared/types/tweet.interface';

interface TweetProps {
  tweet: TweetView;
  canInteract: boolean;
}

const tweetActionClassName =
  'min-w-[108px] rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-sm hover:border-white/18 hover:bg-white/[0.04] hover:text-white';

const likedActionClassName =
  '!border-slate-300/35 !bg-slate-200/18 !text-slate-100 hover:!border-slate-300/45 hover:!bg-slate-200/24';

const bookmarkedActionClassName =
  '!border-teal-300/35 !bg-teal-300/16 !text-teal-50 hover:!border-teal-300/45 hover:!bg-teal-300/22';

const deleteActionClassName =
  'border-white/10 bg-transparent text-white/68 hover:border-rose-300/24 hover:bg-rose-400/[0.06] hover:text-rose-100';

export const Tweet = ({ tweet, canInteract }: TweetProps) => {
  return (
    <SurfaceCard className='p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]'>
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

      <div className='flex flex-wrap items-center gap-3 text-sm text-white/70'>
        <form action={toggleLikeAction}>
          <input type='hidden' name='tweetId' value={tweet.id} />
          <SubmitButton
            idleLabel={`${tweet.isLiked ? 'Unlike' : 'Like'} · ${tweet.likes}`}
            pendingLabel='...'
            className={`${tweetActionClassName} ${
              tweet.isLiked ? likedActionClassName : ''
            } ${!canInteract ? 'pointer-events-none opacity-60' : ''}`}
          />
        </form>
        <form action={toggleBookmarkAction}>
          <input type='hidden' name='tweetId' value={tweet.id} />
          <SubmitButton
            idleLabel={`${tweet.isBookmarked ? 'Bookmarked' : 'Bookmark'} · ${tweet.bookmarks}`}
            pendingLabel='...'
            className={`${tweetActionClassName} ${
              tweet.isBookmarked ? bookmarkedActionClassName : ''
            } ${!canInteract ? 'pointer-events-none opacity-60' : ''}`}
          />
        </form>
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
            Sign in to like tweets and save bookmarks.
          </p>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
