'use client';

import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';

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
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className='relative flex w-full sm:inline-flex sm:w-auto'>
      <button
        type='button'
        onClick={handleCopy}
        className='inline-flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-(--color-border) bg-transparent px-2 py-2 text-xs font-medium text-(--color-text-secondary) backdrop-blur-sm transition hover:border-(--color-border-hover) hover:bg-(--color-surface-hover) hover:text-(--color-text-primary) sm:w-auto sm:min-w-27 sm:px-4 sm:text-sm'
      >
        {copied ? <Check aria-hidden='true' size={16} /> : <Link2 aria-hidden='true' size={16} />}
        <span className='min-w-0 truncate'>
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
