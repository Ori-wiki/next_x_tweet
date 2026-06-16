'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { ModalPortal } from '@/shared/ui/AppProviders';
import { TweetForm } from './TweetForm';

interface ComposeModalProps {
  canCompose: boolean;
  compact?: boolean;
  texts: {
    closeLabel: string;
    title: string;
    submitLabel: string;
    pendingLabel: string;
    placeholder: string;
    mediaUrlPlaceholder: string;
    attachmentLabelPlaceholder: string;
  };
}

export const ComposeModal = ({
  canCompose,
  compact = false,
  texts,
}: ComposeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!canCompose) {
    return null;
  }

  const modal = isOpen ? (
    <div
      className='fixed inset-0 z-100 flex items-end justify-center overflow-y-auto bg-black/60 px-0 pt-12 backdrop-blur-sm sm:items-start sm:px-4 sm:py-16'
      onClick={() => setIsOpen(false)}
    >
      <div
        className='relative z-10 w-full max-w-xl'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='absolute right-3 top-3 z-10 flex justify-end sm:static sm:mb-3'>
          <button
            type='button'
            aria-label={texts.closeLabel}
            onClick={() => setIsOpen(false)}
            className='inline-flex size-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) shadow-(--shadow-card) transition hover:cursor-pointer hover:bg-(--color-surface-hover)'
          >
            <X aria-hidden='true' size={18} />
          </button>
        </div>
        <div className='max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-t-3xl bg-(--color-surface) pb-[env(safe-area-inset-bottom)] sm:max-h-none sm:overflow-visible sm:rounded-none sm:bg-transparent sm:pb-0'>
          <TweetForm
            title={texts.title}
            submitLabel={texts.submitLabel}
            pendingLabel={texts.pendingLabel}
            placeholder={texts.placeholder}
            mediaUrlPlaceholder={texts.mediaUrlPlaceholder}
            attachmentLabelPlaceholder={texts.attachmentLabelPlaceholder}
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type='button'
        aria-label={texts.title}
        title={texts.title}
        onClick={() => setIsOpen(true)}
        className={
          compact
            ? 'inline-flex size-12 items-center justify-center rounded-full bg-(--color-accent) text-(--color-background) shadow-lg shadow-blue-950/40 transition hover:cursor-pointer hover:bg-(--color-accent-hover)'
            : 'ml-3 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-(--color-accent) px-4 text-sm font-semibold text-(--color-background) transition hover:cursor-pointer hover:bg-(--color-accent-hover)'
        }
      >
        <Plus aria-hidden='true' size={compact ? 20 : 16} />
        {!compact ? <span>{texts.title}</span> : null}
      </button>

      <ModalPortal>{modal}</ModalPortal>
    </>
  );
};
