'use client';

import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TweetForm } from '@/features/create-tweet';
import type { TweetView } from '@/entities/tweet';
import type { UserLanguage } from '@/entities/user';
import { PAGES } from '@/shared/config/pages';
import { cn } from '@/shared/lib/cn';
import { formatDateTime, formatNumber } from '@/shared/lib/utils';
import { ModalPortal } from '@/shared/ui/AppProviders';
import { EmptyState } from '@/shared/ui/EmptyState';

interface ReplyModalProps {
  buttonClassName: string;
  canInteract: boolean;
  language?: UserLanguage;
  texts: {
    attachmentLabelPlaceholder: string;
    close: string;
    mediaUrlPlaceholder: string;
    openThread: string;
    pendingLabel: string;
    placeholder: string;
    replies: string;
    replyTitle: string;
    signInToReply: string;
    submitLabel: string;
    thread: string;
    views: string;
  };
  tweet: TweetView;
}

export const ReplyModal = ({
  buttonClassName,
  canInteract,
  language,
  texts,
  tweet,
}: ReplyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const modal = isOpen ? (
    <div className='fixed inset-0 z-[220] flex items-end justify-center overflow-y-auto bg-(--color-overlay) px-0 pt-10 backdrop-blur-md sm:items-start sm:px-4 sm:py-14'>
      <button
        type='button'
        aria-label={texts.close}
        onClick={() => setIsOpen(false)}
        className='absolute inset-0 cursor-default'
      />
      <section
        role='dialog'
        aria-modal='true'
        aria-label={texts.replyTitle}
        className='relative z-10 w-full max-w-2xl rounded-t-3xl border border-(--color-border) bg-(--color-background) p-4 shadow-(--shadow-card) sm:rounded-3xl sm:p-5'
      >
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-xs uppercase tracking-[0.18em] text-(--color-text-subtle)'>
              {texts.thread}
            </p>
            <h2 className='truncate text-lg font-semibold text-(--color-text-primary)'>
              {texts.replyTitle}
            </h2>
          </div>
          <button
            type='button'
            aria-label={texts.close}
            onClick={() => setIsOpen(false)}
            className='inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) transition hover:bg-(--color-surface-hover)'
          >
            <X aria-hidden='true' size={18} />
          </button>
        </div>

        <div className='max-h-[calc(100dvh-8rem)] space-y-4 overflow-y-auto pr-1'>
          <article className='rounded-2xl border border-(--color-border) bg-(--color-surface-faint) p-4'>
            <div className='flex min-w-0 items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='truncate font-semibold text-(--color-text-primary)'>
                  {tweet.author.name}
                </p>
                <p className='truncate text-sm text-(--color-text-secondary)'>
                  @{tweet.author.username} В· {formatDateTime(tweet.createdAt, language)}
                </p>
              </div>
              <Link
                href={PAGES.TWEET(tweet.id)}
                onClick={() => setIsOpen(false)}
                className='shrink-0 rounded-full border border-(--color-border) px-3 py-1 text-xs font-medium text-(--color-accent) transition hover:border-(--color-accent-border-hover) hover:bg-(--color-accent-surface)'
              >
                {texts.openThread}
              </Link>
            </div>
            <p className='mt-3 whitespace-pre-wrap text-sm leading-6 text-(--color-text-strong)'>
              {tweet.content}
            </p>
            <div className='mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-(--color-text-subtle)'>
              <span>
                {formatNumber(tweet.views, language)} {texts.views}
              </span>
              <span>
                {tweet.repliesCount} {texts.replies}
              </span>
            </div>
          </article>

          {canInteract ? (
            <TweetForm
              title={texts.replyTitle}
              submitLabel={texts.submitLabel}
              pendingLabel={texts.pendingLabel}
              placeholder={texts.placeholder}
              mediaUrlPlaceholder={texts.mediaUrlPlaceholder}
              attachmentLabelPlaceholder={texts.attachmentLabelPlaceholder}
              replyToId={tweet.id}
              onSuccess={() => setIsOpen(false)}
              compact
            />
          ) : (
            <EmptyState
              title={texts.replyTitle}
              message={texts.signInToReply}
              actionHref={PAGES.HOME}
              actionLabel={texts.openThread}
              icon='home'
            />
          )}
        </div>
      </section>
    </div>
  ) : null;

  return (
    <>
      <button
        type='button'
        aria-label={texts.replyTitle}
        onClick={() => setIsOpen(true)}
        className={cn(buttonClassName)}
      >
        <MessageCircle aria-hidden='true' size={16} />
        <span className='text-xs sm:hidden' aria-hidden='true'>
          {tweet.repliesCount}
        </span>
        <span className='hidden min-w-0 truncate sm:inline'>
          {texts.thread}
        </span>
      </button>

      <ModalPortal>{modal}</ModalPortal>
    </>
  );
};
