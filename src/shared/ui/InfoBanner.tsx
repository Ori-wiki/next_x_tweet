import { cn } from '@/shared/lib/cn';

interface InfoBannerProps {
  children: React.ReactNode;
  tone?: 'sky' | 'emerald' | 'amber';
}

const toneClassNames = {
  sky: 'border-(--color-accent-border) bg-(--color-accent-surface) text-(--color-accent-text-strong)',
  emerald: 'border-(--color-success-border) bg-(--color-success-surface) text-(--color-success-text)',
  amber: 'border-(--color-warning-border) bg-(--color-warning-surface) text-(--color-warning-text)',
};

export const InfoBanner = ({ children, tone = 'sky' }: InfoBannerProps) => {
  return (
    <div className={cn('rounded-3xl border p-4 text-sm', toneClassNames[tone])}>
      {children}
    </div>
  );
};
