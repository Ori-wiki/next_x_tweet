import Link from 'next/link';
import { Search } from 'lucide-react';
import { SurfaceCard } from './SurfaceCard';

interface EmptyStateProps {
  message: string;
  title?: string;
  actionHref?: string;
  actionLabel?: string;
}

export const EmptyState = ({
  message,
  title = 'Nothing here yet',
  actionHref,
  actionLabel,
}: EmptyStateProps) => {
  return (
    <SurfaceCard className='flex flex-col items-start gap-3 p-6 text-(--color-text-muted)'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-hover) text-(--color-accent)'>
        <Search aria-hidden='true' size={18} />
      </div>
      <div>
        <h2 className='text-lg font-semibold text-(--color-text-primary)'>
          {title}
        </h2>
        <p className='mt-1 text-sm leading-6'>{message}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className='mt-1 rounded-full bg-(--color-accent) px-4 py-2 text-sm font-semibold !text-(--color-background) transition hover:cursor-pointer hover:bg-(--color-accent-hover)'
        >
          {actionLabel}
        </Link>
      ) : null}
    </SurfaceCard>
  );
};
