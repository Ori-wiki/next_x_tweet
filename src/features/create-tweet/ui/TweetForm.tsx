'use client';

import { Link2, Send, Tag } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { SubmitButton } from '@/shared/ui/SubmitButton';
import { SurfaceCard } from '@/shared/ui/SurfaceCard';
import { createTweetAction } from '../model/actions';
import {
  initialTweetActionState,
  type TweetActionState,
} from '../model/state';

interface TweetFormProps {
  title?: string;
  submitLabel?: string;
  replyToId?: string;
  compact?: boolean;
  placeholder?: string;
  mediaUrlPlaceholder?: string;
  attachmentLabelPlaceholder?: string;
  pendingLabel?: string;
  action?: (
    previousState: TweetActionState,
    formData: FormData,
  ) => Promise<TweetActionState>;
}

const maxLength = 280;

export const TweetForm = ({
  title = 'New tweet',
  submitLabel = 'Post tweet',
  replyToId,
  compact = false,
  placeholder = 'What is happening? Add hashtags like #nextjs if you want.',
  mediaUrlPlaceholder = 'Image or link URL',
  attachmentLabelPlaceholder = 'Attachment label, for example figma.com',
  pendingLabel = 'Posting...',
  action = createTweetAction,
}: TweetFormProps) => {
  const [state, formAction] = useActionState(action, initialTweetActionState);
  const [contentLength, setContentLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => setContentLength(0)}
      className={compact ? '' : 'mb-6'}
    >
      <SurfaceCard className='space-y-4 rounded-2xl p-4 text-(--color-text-primary) shadow-(--shadow-form) sm:rounded-3xl'>
        {replyToId ? <input type='hidden' name='replyToId' value={replyToId} /> : null}
        <div className='flex items-center justify-between gap-3'>
          <label className='block text-sm font-semibold text-(--color-text-primary)' htmlFor='content'>
            {title}
          </label>
          <p className='rounded-full border border-(--color-border) bg-(--color-surface-dark-medium) px-3 py-1 text-xs font-medium text-(--color-text-secondary)'>
            {contentLength}/{maxLength}
          </p>
        </div>
        <textarea
          id='content'
          name='content'
          rows={4}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => setContentLength(event.target.value.length)}
          className='w-full resize-none rounded-[20px] border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition placeholder:text-(--color-text-faint) focus:border-(--color-accent) sm:text-base'
        />
        <div className='grid gap-3 sm:grid-cols-2'>
          <label className='flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 text-sm text-(--color-text-secondary) focus-within:border-(--color-accent)'>
            <Link2 aria-hidden='true' className='shrink-0 text-(--color-accent)' size={16} />
            <input
              name='mediaUrl'
              placeholder={mediaUrlPlaceholder}
              className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-(--color-text-faint)'
            />
          </label>
          <label className='flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface-dark-medium) px-4 py-3 text-sm text-(--color-text-secondary) focus-within:border-(--color-accent)'>
            <Tag aria-hidden='true' className='shrink-0 text-(--color-accent)' size={16} />
            <input
              name='attachmentLabel'
              placeholder={attachmentLabelPlaceholder}
              className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-(--color-text-faint)'
            />
          </label>
        </div>

        <div className='flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <div>
            {state.message ? (
              <p
                className={
                  state.status === 'error' ? 'text-(--color-danger)' : 'text-(--color-success)'
                }
              >
                {state.message}
              </p>
            ) : null}
            {state.errors?.content?.map((error) => (
              <p key={error} className='text-(--color-danger)'>
                {error}
              </p>
            ))}
            {state.errors?.mediaUrl?.map((error) => (
              <p key={error} className='text-(--color-danger)'>
                {error}
              </p>
            ))}
            {state.errors?.attachmentLabel?.map((error) => (
              <p key={error} className='text-(--color-danger)'>
                {error}
              </p>
            ))}
          </div>
          <SubmitButton
            idleLabel={
              <>
                <Send aria-hidden='true' size={16} />
                <span>{submitLabel}</span>
              </>
            }
            pendingLabel={pendingLabel}
            className='inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 sm:w-auto'
          />
        </div>
      </SurfaceCard>
    </form>
  );
};
