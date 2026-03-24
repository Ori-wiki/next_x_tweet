import type { PropsWithChildren } from 'react';
import { cn } from '@/app/shared/lib/cn';

interface SurfaceCardProps extends PropsWithChildren {
  className?: string;
}

export const SurfaceCard = ({ className, children }: SurfaceCardProps) => {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/[0.03]',
        className,
      )}
    >
      {children}
    </div>
  );
};
