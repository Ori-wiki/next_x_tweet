import Link from 'next/link';
import { cn } from '@/shared/lib/cn';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'ghost';
  className?: string;
}

const variantClassNames = {
  solid:
    'bg-(--color-surface-solid) !text-(--color-text-inverse) hover:bg-(--color-foreground) font-semibold',
  ghost:
    'border border-(--color-border) bg-(--color-surface-raised) text-(--color-text-primary) hover:bg-(--color-surface-hover)',
};

export const LinkButton = ({
  href,
  children,
  variant = 'ghost',
  className,
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm no-underline transition',
        variantClassNames[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
};
