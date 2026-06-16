'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { useToast } from '@/shared/ui/AppProviders';

interface DeleteTweetButtonProps {
  action: (formData: FormData) => Promise<void>;
  baseClassName: string;
  className?: string;
  deletedLabel: string;
  idleLabel: string;
  pendingLabel: string;
  tweetId: string;
}

export const DeleteTweetButton = ({
  action,
  baseClassName,
  className,
  deletedLabel,
  idleLabel,
  pendingLabel,
  tweetId,
}: DeleteTweetButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
  const formAction = async (formData: FormData) => {
    setIsPending(true);

    try {
      await action(formData);
      showToast(deletedLabel);
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
        className={cn(
          baseClassName,
          className,
          isPending && 'cursor-wait opacity-70',
        )}
      >
        <Trash2 aria-hidden='true' size={16} />
        <span className='hidden sm:inline'>
          {isPending ? pendingLabel : idleLabel}
        </span>
      </button>
    </form>
  );
};
