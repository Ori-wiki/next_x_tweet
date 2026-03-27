import type { PropsWithChildren } from 'react';
import { cn } from '@/app/shared/lib/cn';

interface SurfaceCardProps extends PropsWithChildren {
  className?: string;
}

export const SurfaceCard = ({ className, children }: SurfaceCardProps) => {
  return (
    <div
      className={cn(
        'rounded-3xl border [background:var(--surface)] [border-color:var(--surface-border)]',
        className,
      )}
    >
      {children}
    </div>
  );
};
