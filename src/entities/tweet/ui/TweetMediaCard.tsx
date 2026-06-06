import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/shared/lib/i18n';
import type { TweetMedia } from '../model/types';
import type { Language as UserLanguage } from '@/shared/config/language';

interface TweetMediaCardProps {
  media: TweetMedia;
  language?: UserLanguage;
}

export const TweetMediaCard = ({ media, language }: TweetMediaCardProps) => {
  const { tweet } = getDictionary(language);

  if (media.type === 'image') {
    return (
      <div className='overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface-dark-medium)'>
        <div className='relative aspect-[16/9] w-full'>
          <Image
            src={media.url}
            alt={media.title ?? tweet.tweetMedia}
            fill
            unoptimized
            className='object-cover'
          />
        </div>
        {(media.title || media.description) && (
          <div className='space-y-1 px-4 py-3'>
            {media.title ? <p className='font-medium text-(--color-text-primary)'>{media.title}</p> : null}
            {media.description ? (
              <p className='text-sm text-(--color-text-soft)'>{media.description}</p>
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
      className='block rounded-3xl border border-(--color-border) bg-(--color-surface-dark) p-4 transition hover:border-(--color-accent-border-soft) hover:bg-(--color-accent-surface)'
    >
      <p className='text-xs uppercase tracking-[0.18em] text-(--color-text-subtle)'>
        {media.attachmentLabel ?? tweet.linkPreview}
      </p>
      <p className='mt-2 text-lg font-semibold text-(--color-text-primary)'>
        {media.title ?? media.url}
      </p>
      {media.description ? (
        <p className='mt-2 text-sm text-(--color-text-soft)'>{media.description}</p>
      ) : null}
      <p className='mt-3 text-sm text-(--color-accent-text)'>{media.url}</p>
    </Link>
  );
};
