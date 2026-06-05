import { SurfaceCard } from './SurfaceCard';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  helper?: string;
}

export const StatCard = ({ label, value, accent, helper }: StatCardProps) => {
  return (
    <SurfaceCard className='flex min-h-18 items-center justify-between gap-4 px-4 py-3'>
      <div className='min-w-0'>
        <p className='truncate text-sm text-[var(--color-text-soft)]'>{label}</p>
        {helper ? <p className='mt-1 truncate text-sm text-[var(--color-accent-text)]'>{helper}</p> : null}
      </div>
      <p className={`shrink-0 font-semibold text-[var(--color-text-primary)] ${accent ?? 'text-2xl'}`}>
        {value}
      </p>
    </SurfaceCard>
  );
};
