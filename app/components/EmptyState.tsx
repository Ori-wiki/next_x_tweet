import { SurfaceCard } from './SurfaceCard';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <SurfaceCard className='border-dashed border-white/15 bg-white/[0.02] p-6 text-white/65'>
      {message}
    </SurfaceCard>
  );
};
