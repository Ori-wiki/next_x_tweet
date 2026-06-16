'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ActionResult } from '@/shared/lib/actionResult';
import { ActionButton } from '@/shared/ui/ActionButton';
import { useToast } from '@/shared/ui/AppProviders';
import type { DeleteTweetResult } from '@/features/delete-tweet';

interface DeleteTweetButtonProps {
  action: (formData: FormData) => Promise<DeleteTweetResult>;
  baseClassName: string;
  className?: string;
  deletedLabel: string;
  restoredLabel: string;
  idleLabel: string;
  pendingLabel: string;
  restoreAction: (formData: FormData) => Promise<ActionResult>;
  tweetId: string;
  undoLabel: string;
}

export const DeleteTweetButton = ({
  action,
  baseClassName,
  className,
  deletedLabel,
  restoredLabel,
  idleLabel,
  pendingLabel,
  restoreAction,
  tweetId,
  undoLabel,
}: DeleteTweetButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
  const formAction = async (formData: FormData) => {
    setIsPending(true);

    try {
      const result = await action(formData);
      const deletedTweet = result.payload?.deletedTweet;

      showToast(
        deletedLabel,
        'success',
        deletedTweet
          ? {
              label: undoLabel,
              onClick: async () => {
                const restoreFormData = new FormData();
                restoreFormData.set('tweet', JSON.stringify(deletedTweet));
                await restoreAction(restoreFormData);
                showToast(restoredLabel);
              },
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
        baseClassName={baseClassName}
        className={className}
        disabled={isPending}
        icon={Trash2}
        isPending={isPending}
        label={isPending ? pendingLabel : idleLabel}
      />
    </form>
  );
};
