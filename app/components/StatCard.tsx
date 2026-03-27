import { SurfaceCard } from './SurfaceCard';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
}

export const StatCard = ({ label, value, accent }: StatCardProps) => {
  return (
    <SurfaceCard className='rounded-2xl bg-black/20 px-4 py-3'>
      <p className='text-sm text-white/50'>{label}</p>
      <p className={`mt-1 font-semibold text-white ${accent ?? 'text-3xl'}`}>
        {value}
      </p>
    </SurfaceCard>
  );
};
