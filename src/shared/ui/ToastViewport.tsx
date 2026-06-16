'use client';

import { CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/cn';

type ToastTone = 'success' | 'info';

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

type ToastEvent = CustomEvent<{
  message: string;
  tone?: ToastTone;
}>;

const toastEventName = 'next-x-toast';

export function showToast(message: string, tone: ToastTone = 'success') {
  window.dispatchEvent(
    new CustomEvent(toastEventName, {
      detail: { message, tone },
    }),
  );
}

export const ToastViewport = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toastEvent = event as ToastEvent;
      const id = Date.now();

      setToasts((current) => [
        ...current,
        {
          id,
          message: toastEvent.detail.message,
          tone: toastEvent.detail.tone ?? 'success',
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2600);
    };

    window.addEventListener(toastEventName, handleToast);

    return () => window.removeEventListener(toastEventName, handleToast);
  }, []);

  return (
    <div className='pointer-events-none fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[300] flex flex-col items-center gap-2 sm:bottom-5 sm:items-end'>
      {toasts.map((toast) => {
        const Icon = toast.tone === 'success' ? CheckCircle2 : Info;

        return (
          <div
            key={toast.id}
            className={cn(
              'toast-enter pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-(--color-surface) px-4 py-3 text-sm font-medium text-(--color-text-primary) shadow-(--shadow-card)',
              toast.tone === 'success'
                ? 'border-(--color-accent-border) text-(--color-text-primary)'
                : 'border-(--color-border)',
            )}
            role='status'
          >
            <Icon
              aria-hidden='true'
              size={18}
              className={toast.tone === 'success' ? 'text-(--color-accent)' : 'text-(--color-text-secondary)'}
            />
            <span className='min-w-0 flex-1'>{toast.message}</span>
            <button
              type='button'
              aria-label='Dismiss notification'
              onClick={() =>
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                )
              }
              className='inline-flex size-7 shrink-0 items-center justify-center rounded-full text-(--color-text-secondary) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)'
            >
              <X aria-hidden='true' size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
