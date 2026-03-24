import type { PropsWithChildren } from 'react';
import { cn } from '@/app/shared/lib/cn';

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
        'rounded-4xl border border-white/10 p-6',
        'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_45%),rgba(255,255,255,0.03)]',
        className,
      )}
    >
      <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
        {eyebrow}
      </p>
      <h1 className='mt-2 text-2xl font-bold text-white sm:text-3xl'>
        {title}
      </h1>
      <p className='mt-3 max-w-2xl text-white/70'>{description}</p>
      {children ? <div className='mt-5'>{children}</div> : null}
    </section>
  );
};
