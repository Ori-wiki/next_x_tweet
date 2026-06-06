import { SurfaceCard } from './SurfaceCard';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  helper?: string;
  compactOnMobile?: boolean;
}

export const StatCard = ({
  label,
  value,
  accent,
  helper,
  compactOnMobile = false,
}: StatCardProps) => {
  return (
    <SurfaceCard
      className={
        compactOnMobile
          ? 'flex min-h-0 min-w-0 flex-col items-start gap-0 px-2 py-2 sm:min-h-18 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3'
          : 'flex min-h-18 items-center justify-between gap-4 px-4 py-3'
      }
    >
      <div className='min-w-0'>
        <p className='truncate text-sm text-(--color-text-soft)'>{label}</p>
        {helper ? <p className='mt-1 truncate text-sm text-(--color-accent-text)'>{helper}</p> : null}
      </div>
      <p className={`shrink-0 font-semibold text-(--color-text-primary) ${accent ?? 'text-2xl'}`}>
        {value}
      </p>
    </SurfaceCard>
  );
};
