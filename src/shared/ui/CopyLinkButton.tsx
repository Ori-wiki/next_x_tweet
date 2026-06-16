'use client';

import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import { showToast } from './ToastViewport';

interface CopyLinkButtonProps {
  url: string;
  label: string;
  copiedLabel: string;
}

export const CopyLinkButton = ({
  url,
  label,
  copiedLabel,
}: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast(copiedLabel);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className='relative flex min-w-0 w-full sm:inline-flex sm:w-auto'>
      <button
        type='button'
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : label}
        className='mx-1 inline-flex min-h-11 w-[calc(100%-0.5rem)] min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-transparent px-1 py-2 text-xs font-medium text-(--color-text-secondary) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:mx-0 sm:min-h-0 sm:w-auto sm:min-w-27 sm:border-(--color-border) sm:px-4 sm:text-sm'
      >
        {copied ? <Check aria-hidden='true' size={16} /> : <Link2 aria-hidden='true' size={16} />}
        <span className='hidden min-w-0 truncate sm:inline'>
          {copied ? copiedLabel : label}
        </span>
      </button>
      {copied ? (
        <span className='pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-xs font-medium text-(--color-text-primary) shadow-(--shadow-card)'>
          {copiedLabel}
        </span>
      ) : null}
    </div>
  );
};
