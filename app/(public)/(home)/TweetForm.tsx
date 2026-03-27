'use client';

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
      <SurfaceCard className='space-y-3 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]'>
        {replyToId ? <input type='hidden' name='replyToId' value={replyToId} /> : null}
        <label className='block text-sm font-medium text-white/80' htmlFor='content'>
          {title}
        </label>
        <textarea
          id='content'
          name='content'
          rows={4}
          maxLength={maxLength}
          placeholder='What is happening? Add hashtags like #nextjs if you want.'
          onChange={(event) => setContentLength(event.target.value.length)}
          className='w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400 sm:text-base'
        />
        <div className='grid gap-3 sm:grid-cols-2'>
          <input
            name='mediaUrl'
            placeholder='Image or link URL'
            className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
          />
          <input
            name='attachmentLabel'
            placeholder='Attachment label, for example figma.com'
            className='rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400'
          />
        </div>

        <div className='flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-white/60'>{contentLength}/{maxLength}</p>
            {state.message ? (
              <p
                className={
                  state.status === 'error' ? 'text-rose-300' : 'text-emerald-300'
                }
              >
                {state.message}
              </p>
            ) : null}
            {state.errors?.content?.map((error) => (
              <p key={error} className='text-rose-300'>
                {error}
              </p>
            ))}
            {state.errors?.mediaUrl?.map((error) => (
              <p key={error} className='text-rose-300'>
                {error}
              </p>
            ))}
            {state.errors?.attachmentLabel?.map((error) => (
              <p key={error} className='text-rose-300'>
                {error}
              </p>
            ))}
          </div>
          <SubmitButton idleLabel={submitLabel} pendingLabel='Posting...' />
        </div>
      </SurfaceCard>
    </form>
  );
};
