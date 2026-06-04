'use client';

import { Link2, Send, Tag } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { SubmitButton } from '@/app/components/SubmitButton';
import { SurfaceCard } from '@/app/components/SurfaceCard';
import { createTweetAction } from '@/app/server-actions/post-tweet';
import {
  initialTweetActionState,
  type TweetActionState,
} from '@/app/server-actions/post-tweet.state';

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
      <SurfaceCard className='space-y-4 p-4 text-[var(--color-text-primary)] shadow-[var(--shadow-form)]'>
        {replyToId ? <input type='hidden' name='replyToId' value={replyToId} /> : null}
        <div className='flex items-center justify-between gap-3'>
          <label className='block text-sm font-semibold text-[var(--color-text-primary)]' htmlFor='content'>
            {title}
          </label>
          <p className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface-dark-medium)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]'>
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
          className='w-full resize-none rounded-[20px] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] sm:text-base'
        />
        <div className='grid gap-3 sm:grid-cols-2'>
          <label className='flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark-medium)] px-4 py-3 text-sm text-[var(--color-text-secondary)] focus-within:border-[var(--color-accent)]'>
            <Link2 aria-hidden='true' className='shrink-0 text-[var(--color-accent)]' size={16} />
            <input
              name='mediaUrl'
              placeholder={mediaUrlPlaceholder}
              className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-faint)]'
            />
          </label>
          <label className='flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-dark-medium)] px-4 py-3 text-sm text-[var(--color-text-secondary)] focus-within:border-[var(--color-accent)]'>
            <Tag aria-hidden='true' className='shrink-0 text-[var(--color-accent)]' size={16} />
            <input
              name='attachmentLabel'
              placeholder={attachmentLabelPlaceholder}
              className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-faint)]'
            />
          </label>
        </div>

        <div className='flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <div>
            {state.message ? (
              <p
                className={
                  state.status === 'error' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'
                }
              >
                {state.message}
              </p>
            ) : null}
            {state.errors?.content?.map((error) => (
              <p key={error} className='text-[var(--color-danger)]'>
                {error}
              </p>
            ))}
            {state.errors?.mediaUrl?.map((error) => (
              <p key={error} className='text-[var(--color-danger)]'>
                {error}
              </p>
            ))}
            {state.errors?.attachmentLabel?.map((error) => (
              <p key={error} className='text-[var(--color-danger)]'>
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
            className='inline-flex items-center justify-center gap-2 px-5'
          />
        </div>
      </SurfaceCard>
    </form>
  );
};
