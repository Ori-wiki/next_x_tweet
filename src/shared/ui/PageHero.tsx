import type { PropsWithChildren } from 'react';
import { cn } from '@/shared/lib/cn';

interface PageHeroProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export const PageHero = ({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6',
        className,
      )}
    >
      <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
        {eyebrow}
      </p>
      <h1 className='mt-2 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl'>
        {title}
      </h1>
      <p className='mt-3 max-w-2xl text-[var(--color-text-secondary)]'>{description}</p>
      {children ? <div className='mt-5'>{children}</div> : null}
    </section>
  );
};
