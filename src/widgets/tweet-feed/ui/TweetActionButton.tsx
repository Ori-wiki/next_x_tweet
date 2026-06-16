'use client';

import { Bookmark, Heart, Repeat2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState } from 'react';
import { ActionButton } from '@/shared/ui/ActionButton';
import { useToast } from '@/shared/ui/AppProviders';

type TweetActionKind = 'like' | 'bookmark' | 'repost';

interface TweetActionButtonProps {
  action: (formData: FormData) => Promise<unknown>;
  active: boolean;
  activeClassName: string;
  activeLabel: string;
  baseClassName: string;
  count: number;
  inactiveLabel: string;
  kind: TweetActionKind;
  toastAction?: {
    href: string;
    label: string;
  };
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
  toastAction,
  toastLabel,
  tweetId,
}: TweetActionButtonProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
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
      showToast(
        toastLabel,
        'success',
        toastAction
          ? {
              label: toastAction.label,
              onClick: () => router.push(toastAction.href),
            }
          : undefined,
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction} className='min-w-0'>
      <input type='hidden' name='tweetId' value={tweetId} />
      <ActionButton
        type='submit'
        active={optimisticState.active}
        activeClassName={activeClassName}
        ariaLabel={`${label}: ${optimisticState.count}`}
        baseClassName={baseClassName}
        disabled={isPending}
        icon={Icon}
        isPending={isPending}
      >
        <span className='hidden min-w-0 truncate sm:inline'>
          {label} {'\u00b7'} {optimisticState.count}
        </span>
        <span className='text-xs sm:hidden' aria-hidden='true'>
          {optimisticState.count}
        </span>
      </ActionButton>
    </form>
  );
};
