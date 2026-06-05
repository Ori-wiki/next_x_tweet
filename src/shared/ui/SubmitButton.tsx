'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  idleLabel: ReactNode;
  pendingLabel: ReactNode;
  className?: string;
}

export const SubmitButton = ({
  idleLabel,
  pendingLabel,
  className,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className={`cursor-pointer rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
};
