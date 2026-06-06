'use client';

import { Bookmark, Heart, Repeat2 } from 'lucide-react';
import { useOptimistic, useState } from 'react';
import { cn } from '@/shared/lib/cn';

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
  const formAction = async (formData: FormData) => {
    setIsPending(true);
    toggleOptimisticState(undefined);

    try {
      await action(formData);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction}>
      <input type='hidden' name='tweetId' value={tweetId} />
      <button
        type='submit'
        disabled={isPending}
        className={cn(
          baseClassName,
          optimisticState.active && activeClassName,
          isPending && 'cursor-wait opacity-80',
        )}
      >
        <Icon aria-hidden='true' size={16} />
        <span>
          {optimisticState.active ? activeLabel : inactiveLabel} · {optimisticState.count}
        </span>
      </button>
    </form>
  );
};
