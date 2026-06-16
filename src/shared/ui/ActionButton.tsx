'use client';

import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface ActionButtonProps {
  active?: boolean;
  activeClassName?: string;
  ariaLabel?: string;
  baseClassName: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon: ComponentType<{ 'aria-hidden'?: 'true'; size?: number }>;
  isPending?: boolean;
  label?: string;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit';
}

export const ActionButton = ({
  active = false,
  activeClassName,
  ariaLabel,
  baseClassName,
  children,
  className,
  disabled = false,
  icon: Icon,
  isPending = false,
  label,
  onClick,
  type = 'button',
}: ActionButtonProps) => (
  <button
    type={type}
    disabled={disabled || isPending}
    aria-label={ariaLabel ?? label}
    onClick={onClick}
    className={cn(
      baseClassName,
      className,
      active && activeClassName,
      active && 'reaction-pop ring-1 ring-current/15',
      isPending && 'cursor-wait opacity-70',
    )}
  >
    <Icon aria-hidden='true' size={16} />
    {children ?? (
      <span className='hidden min-w-0 truncate sm:inline'>{label}</span>
    )}
  </button>
);
