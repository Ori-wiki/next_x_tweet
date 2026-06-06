import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

interface UserAvatarProps {
  alt: string;
  className?: string;
  sizes: string;
  src: string;
}

export const UserAvatar = ({
  alt,
  className,
  sizes,
  src,
}: UserAvatarProps) => (
  <span
    className={cn(
      'relative block shrink-0 overflow-hidden rounded-full bg-(--color-surface-solid)',
      className,
    )}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className='object-cover'
    />
  </span>
);
