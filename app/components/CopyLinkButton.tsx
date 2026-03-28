'use client';

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
    <button
      type='button'
      onClick={handleCopy}
      className='min-w-[108px] rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-sm transition hover:border-white/18 hover:bg-white/[0.04] hover:text-white'
    >
      {copied ? copiedLabel : label}
    </button>
  );
};
