'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';
import { getDictionary } from '@/shared/lib/i18n';
import { Modal } from '@/shared/ui/AppProviders';
import type { TweetMedia } from '../model/types';
import type { Language as UserLanguage } from '@/shared/config/language';

interface TweetMediaCardProps {
  media: TweetMedia;
  language?: UserLanguage;
}

export const TweetMediaCard = ({ media, language }: TweetMediaCardProps) => {
  const { tweet } = getDictionary(language);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (media.type === 'image') {
    const imageAlt = media.title ?? tweet.tweetMedia;

    return (
      <>
        <div className='overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface-dark-medium)'>
          <button
            type='button'
            aria-label={tweet.openMedia}
            onClick={() => setIsLightboxOpen(true)}
            className='relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden text-left'
          >
            <Image
              src={media.url}
              alt={imageAlt}
              fill
              unoptimized
              className='object-cover transition duration-300 hover:scale-[1.02]'
            />
          </button>
          {(media.title || media.description) && (
            <div className='space-y-1 px-4 py-3'>
              {media.title ? <p className='font-medium text-(--color-text-primary)'>{media.title}</p> : null}
              {media.description ? (
                <p className='text-sm text-(--color-text-soft)'>{media.description}</p>
              ) : null}
            </div>
          )}
        </div>

        <Modal
          ariaLabel={imageAlt}
          open={isLightboxOpen}
          onOpenChange={setIsLightboxOpen}
          overlayClassName='z-[260] flex items-center justify-center bg-black/85 p-3 backdrop-blur-xl sm:p-6'
          className='relative flex h-full max-h-[92dvh] w-full max-w-6xl items-center justify-center outline-none'
        >
          <button
            type='button'
            aria-label={tweet.closeMedia}
            onClick={() => setIsLightboxOpen(false)}
            className='absolute right-2 top-2 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-black/70 sm:right-4 sm:top-4'
          >
            <X aria-hidden='true' size={19} />
          </button>
          <div className='relative max-h-full w-full overflow-hidden rounded-2xl'>
            <Image
              src={media.url}
              alt={imageAlt}
              width={1600}
              height={900}
              unoptimized
              className='mx-auto max-h-[92dvh] w-auto max-w-full object-contain'
            />
          </div>
        </Modal>
      </>
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
