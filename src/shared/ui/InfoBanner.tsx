import { cn } from '@/src/shared/lib/cn';

interface InfoBannerProps {
  children: React.ReactNode;
  tone?: 'sky' | 'emerald' | 'amber';
}

const toneClassNames = {
  sky: 'border-[var(--color-accent-border)] bg-[var(--color-accent-surface)] text-[var(--color-accent-text-strong)]',
  emerald: 'border-[var(--color-success-border)] bg-[var(--color-success-surface)] text-[var(--color-success-text)]',
  amber: 'border-[var(--color-warning-border)] bg-[var(--color-warning-surface)] text-[var(--color-warning-text)]',
};

export const InfoBanner = ({ children, tone = 'sky' }: InfoBannerProps) => {
  return (
    <div className={cn('rounded-3xl border p-4 text-sm', toneClassNames[tone])}>
      {children}
    </div>
  );
};
