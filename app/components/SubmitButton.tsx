'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  idleLabel: string;
  pendingLabel: string;
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
      className={`rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ''}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
};
