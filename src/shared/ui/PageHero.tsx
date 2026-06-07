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
        'rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:rounded-3xl sm:p-6',
        className,
      )}
    >
      <p className='text-xs uppercase tracking-[0.18em] text-(--color-text-subtle) sm:text-sm sm:tracking-[0.2em]'>
        {eyebrow}
      </p>
      <h1 className='mt-2 text-[1.65rem] font-bold leading-tight text-(--color-text-primary) sm:text-3xl'>
        {title}
      </h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-(--color-text-secondary) sm:mt-3 sm:text-base'>
        {description}
      </p>
      {children ? <div className='mt-5'>{children}</div> : null}
    </section>
  );
};
