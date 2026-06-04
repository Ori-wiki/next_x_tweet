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
    <div className='relative inline-flex'>
      <button
        type='button'
        onClick={handleCopy}
        className='inline-flex min-w-[108px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] backdrop-blur-sm transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
      >
        {copied ? <Check aria-hidden='true' size={16} /> : <Link2 aria-hidden='true' size={16} />}
        <span>{copied ? copiedLabel : label}</span>
      </button>
      {copied ? (
        <span className='pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-card)]'>
          {copiedLabel}
        </span>
      ) : null}
    </div>
  );
};
