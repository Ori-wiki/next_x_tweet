import { cn } from '@/app/shared/lib/cn';

interface InfoBannerProps {
  children: React.ReactNode;
  tone?: 'sky' | 'emerald' | 'amber';
}

const toneClassNames = {
  sky: 'border-sky-300/20 bg-sky-400/10 text-sky-100',
  emerald: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  amber: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
};

export const InfoBanner = ({ children, tone = 'sky' }: InfoBannerProps) => {
  return (
    <div className={cn('rounded-3xl border p-4 text-sm', toneClassNames[tone])}>
      {children}
    </div>
  );
};
