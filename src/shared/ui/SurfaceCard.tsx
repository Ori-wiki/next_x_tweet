import type { PropsWithChildren } from 'react';
import { cn } from '@/src/shared/lib/cn';

interface SurfaceCardProps extends PropsWithChildren {
  className?: string;
}

export const SurfaceCard = ({ className, children }: SurfaceCardProps) => {
  return (
    <div
      className={cn(
        'rounded-[24px] border [background:var(--surface)] [border-color:var(--surface-border)] transition-colors hover:[background:var(--color-surface-hover)] hover:[border-color:var(--color-border-hover)]',
        className,
      )}
    >
      {children}
    </div>
  );
};
