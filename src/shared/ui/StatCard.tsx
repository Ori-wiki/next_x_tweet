import { SurfaceCard } from './SurfaceCard';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  helper?: string;
}

export const StatCard = ({ label, value, accent, helper }: StatCardProps) => {
  return (
    <SurfaceCard className='flex h-full flex-col px-4 py-3'>
      <p className='text-sm text-[var(--color-text-soft)]'>{label}</p>
      <p className={`mt-1 font-semibold text-[var(--color-text-primary)] ${accent ?? 'text-3xl'}`}>
        {value}
      </p>
      {helper ? <p className='mt-2 text-sm text-[var(--color-accent-text)]'>{helper}</p> : null}
    </SurfaceCard>
  );
};
