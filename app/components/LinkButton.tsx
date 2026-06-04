import Link from 'next/link';
import { cn } from '@/app/shared/lib/cn';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'ghost';
  className?: string;
}

const variantClassNames = {
  solid:
    'bg-[var(--color-surface-solid)] !text-[var(--color-text-inverse)] hover:bg-[var(--color-foreground)] font-semibold',
  ghost:
    'border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]',
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
