import { SurfaceCard } from './SurfaceCard';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  helper?: string;
}

export const StatCard = ({ label, value, accent, helper }: StatCardProps) => {
  return (
    <SurfaceCard className='flex h-full flex-col rounded-2xl bg-black/20 px-4 py-3'>
      <p className='text-sm text-white/50'>{label}</p>
      <p className={`mt-1 font-semibold text-white ${accent ?? 'text-3xl'}`}>
        {value}
      </p>
      {helper ? <p className='mt-2 text-sm text-sky-200'>{helper}</p> : null}
    </SurfaceCard>
  );
};
