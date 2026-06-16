'use client';

import { Bookmark, Heart, Repeat2 } from 'lucide-react';
import { useOptimistic, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { showToast } from '@/shared/ui/ToastViewport';

type TweetActionKind = 'like' | 'bookmark' | 'repost';

interface TweetActionButtonProps {
  action: (formData: FormData) => Promise<void>;
  active: boolean;
  activeClassName: string;
  activeLabel: string;
  baseClassName: string;
  count: number;
  inactiveLabel: string;
  kind: TweetActionKind;
  toastLabel: string;
  tweetId: string;
}

const icons = {
  like: Heart,
  bookmark: Bookmark,
  repost: Repeat2,
};

export const TweetActionButton = ({
  action,
  active,
  activeClassName,
  activeLabel,
  baseClassName,
  count,
  inactiveLabel,
  kind,
  toastLabel,
  tweetId,
}: TweetActionButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const [optimisticState, toggleOptimisticState] = useOptimistic(
    { active, count },
    (state) => ({
      active: !state.active,
      count: Math.max(0, state.count + (state.active ? -1 : 1)),
    }),
  );
  const Icon = icons[kind];
  const label = optimisticState.active ? activeLabel : inactiveLabel;
  const formAction = async (formData: FormData) => {
    setIsPending(true);
    toggleOptimisticState(undefined);

    try {
      await action(formData);
      showToast(toastLabel);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction} className='min-w-0'>
      <input type='hidden' name='tweetId' value={tweetId} />
      <button
        type='submit'
        disabled={isPending}
        aria-label={`${label}: ${optimisticState.count}`}
        className={cn(
          baseClassName,
          optimisticState.active && activeClassName,
          optimisticState.active && 'reaction-pop ring-1 ring-current/15',
          isPending && 'cursor-wait opacity-80',
        )}
      >
        <Icon aria-hidden='true' size={16} />
        <span className='hidden min-w-0 truncate sm:inline'>
          {label} · {optimisticState.count}
        </span>
        <span className='text-xs sm:hidden' aria-hidden='true'>
          {optimisticState.count}
        </span>
      </button>
    </form>
  );
};
