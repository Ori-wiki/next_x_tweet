import Image from 'next/image';
import Link from 'next/link';
import type { TweetMedia } from '@/app/shared/types/tweet.interface';

interface TweetMediaCardProps {
  media: TweetMedia;
}

export const TweetMediaCard = ({ media }: TweetMediaCardProps) => {
  if (media.type === 'image') {
    return (
      <div className='overflow-hidden rounded-3xl border border-white/10 bg-black/30'>
        <div className='relative aspect-[16/9] w-full'>
          <Image
            src={media.url}
            alt={media.title ?? 'Tweet media'}
            fill
            unoptimized
            className='object-cover'
          />
        </div>
        {(media.title || media.description) && (
          <div className='space-y-1 px-4 py-3'>
            {media.title ? <p className='font-medium text-white'>{media.title}</p> : null}
            {media.description ? (
              <p className='text-sm text-white/60'>{media.description}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={media.url}
      target='_blank'
      rel='noreferrer'
      className='block rounded-3xl border border-white/10 bg-black/25 p-4 transition hover:border-sky-300/35 hover:bg-sky-400/8'
    >
      <p className='text-xs uppercase tracking-[0.18em] text-white/40'>
        {media.attachmentLabel ?? 'Link preview'}
      </p>
      <p className='mt-2 text-lg font-semibold text-white'>
        {media.title ?? media.url}
      </p>
      {media.description ? (
        <p className='mt-2 text-sm text-white/60'>{media.description}</p>
      ) : null}
      <p className='mt-3 text-sm text-sky-200'>{media.url}</p>
    </Link>
  );
};
