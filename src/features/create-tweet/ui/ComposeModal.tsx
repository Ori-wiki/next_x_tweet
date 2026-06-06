'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { TweetForm } from './TweetForm';

interface ComposeModalProps {
  canCompose: boolean;
  compact?: boolean;
  texts: {
    title: string;
    submitLabel: string;
    pendingLabel: string;
    placeholder: string;
    mediaUrlPlaceholder: string;
    attachmentLabelPlaceholder: string;
  };
}

export const ComposeModal = ({ canCompose, compact = false, texts }: ComposeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!canCompose) {
    return null;
  }

  return (
    <>
      <button
        type='button'
        aria-label='New tweet'
        title='New tweet'
        onClick={() => setIsOpen(true)}
        className={
          compact
            ? 'inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-accent) text-(--color-background) transition hover:cursor-pointer hover:bg-(--color-accent-hover)'
            : 'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-(--color-accent) px-4 text-sm font-semibold text-(--color-background) transition hover:cursor-pointer hover:bg-(--color-accent-hover)'
        }
      >
        <Plus aria-hidden='true' size={16} />
        {!compact ? <span>New tweet</span> : null}
      </button>

      {isOpen ? (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-16 backdrop-blur-sm'>
          <div className='w-full max-w-xl'>
            <div className='mb-3 flex justify-end'>
              <button
                type='button'
                aria-label='Close'
                onClick={() => setIsOpen(false)}
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) transition hover:cursor-pointer hover:bg-(--color-surface-hover)'
              >
                <X aria-hidden='true' size={18} />
              </button>
            </div>
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
      ) : null}
    </>
  );
};
