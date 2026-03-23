'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createTweetAction } from '@/app/server-actions/post-tweet';
import {
  initialTweetActionState,
  type TweetActionState,
} from '@/app/server-actions/post-tweet.state';
import { SubmitButton } from '@/app/components/SubmitButton';

interface TweetFormProps {
  action?: (
    previousState: TweetActionState,
    formData: FormData,
  ) => Promise<TweetActionState>;
}

const maxLength = 280;

export const TweetForm = ({ action = createTweetAction }: TweetFormProps) => {
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
      className='mb-6 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]'
    >
      <label className='block text-sm font-medium text-white/80' htmlFor='content'>
        Новый твит
      </label>
      <textarea
        id='content'
        name='content'
        rows={4}
        maxLength={maxLength}
        placeholder='Что нового? Можно добавить и хэштеги, например #nextjs'
        onChange={(event) => setContentLength(event.target.value.length)}
        className='w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-white/35 focus:border-sky-400 sm:text-base'
      />

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
        </div>
        <SubmitButton idleLabel='Опубликовать' pendingLabel='Публикуем...' />
      </div>
    </form>
  );
};
