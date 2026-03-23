import Link from 'next/link';
import Image from 'next/image';
import { PAGES } from '@/app/config/pages.config';
import { formatRelativeDate } from '@/app/shared/lib/utils';
import { toggleBookmarkAction, toggleLikeAction } from '@/app/server-actions/post-tweet';
import type { TweetView } from '@/app/shared/types/tweet.interface';
import { SubmitButton } from '@/app/components/SubmitButton';

interface TweetProps {
  tweet: TweetView;
  canInteract: boolean;
}

export const Tweet = ({ tweet, canInteract }: TweetProps) => {
  return (
    <article className='rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]'>
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
            idleLabel={`${tweet.isLiked ? 'Убрать лайк' : 'Лайк'} · ${tweet.likes}`}
            pendingLabel='...'
            className={`${
              tweet.isLiked
                ? 'bg-rose-400 text-white hover:bg-rose-300'
                : 'bg-white/10 text-white hover:bg-white/15'
            } ${!canInteract ? 'pointer-events-none opacity-60' : ''}`}
          />
        </form>
        <form action={toggleBookmarkAction}>
          <input type='hidden' name='tweetId' value={tweet.id} />
          <SubmitButton
            idleLabel={`${
              tweet.isBookmarked ? 'В закладках' : 'Закладка'
            } · ${tweet.bookmarks}`}
            pendingLabel='...'
            className={`${
              tweet.isBookmarked
                ? 'bg-amber-300 text-black hover:bg-amber-200'
                : 'bg-white/10 text-white hover:bg-white/15'
            } ${!canInteract ? 'pointer-events-none opacity-60' : ''}`}
          />
        </form>
        {!canInteract ? (
          <p className='text-sm text-white/45'>
            Войди в демо-аккаунт, чтобы ставить лайки и сохранять твиты.
          </p>
        ) : null}
      </div>
    </article>
  );
};
