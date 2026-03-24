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
    'bg-white !text-black hover:bg-slate-100 font-semibold',
  ghost:
    'border border-white/10 bg-white/10 text-white hover:bg-white/15',
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
