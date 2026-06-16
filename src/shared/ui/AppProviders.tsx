'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useIsHydrated } from '@/shared/lib/useIsHydrated';

type ToastTone = 'success' | 'info';

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

interface ModalProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  overlayClassName?: string;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const ModalContext = createContext<HTMLElement | null>(null);
let openModalCount = 0;
let previousBodyOverflow = '';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside AppProviders');
  }

  return context;
}

export const ModalPortal = ({ children }: { children: ReactNode }) => {
  const root = useContext(ModalContext);

  return root ? createPortal(children, root) : null;
};

export const Modal = ({
  ariaLabel,
  children,
  className,
  closeOnOverlayClick = true,
  onOpenChange,
  open,
  overlayClassName,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement = document.activeElement;

    if (openModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    openModalCount += 1;

    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    window.requestAnimationFrame(() => {
      (focusTarget ?? panelRef.current)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      openModalCount = Math.max(0, openModalCount - 1);

      if (openModalCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <ModalPortal>
      <div
        className={cn(
          'fixed inset-0 z-[220] overflow-y-auto bg-(--color-overlay) backdrop-blur-md',
          overlayClassName,
        )}
        onMouseDown={(event) => {
          if (closeOnOverlayClick && event.target === event.currentTarget) {
            onOpenChange(false);
          }
        }}
      >
        <div
          ref={panelRef}
          role='dialog'
          aria-modal='true'
          aria-label={ariaLabel}
          tabIndex={-1}
          className={className}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isHydrated = useIsHydrated();
  const modalRoot = isHydrated ? document.body : null;

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();

    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => removeToast(id), 2600);
  }, [removeToast]);

  const toastValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={toastValue}>
      <ModalContext.Provider value={modalRoot}>
        {children}
        <div className='pointer-events-none fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[300] flex flex-col items-center gap-2 sm:bottom-5 sm:items-end'>
          {toasts.map((toast) => {
            const Icon = toast.tone === 'success' ? CheckCircle2 : Info;

            return (
              <div
                key={toast.id}
                className={cn(
                  'toast-enter pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-(--color-surface) px-4 py-3 text-sm font-medium text-(--color-text-primary) shadow-(--shadow-card)',
                  toast.tone === 'success'
                    ? 'border-(--color-accent-border)'
                    : 'border-(--color-border)',
                )}
                role='status'
              >
                <Icon
                  aria-hidden='true'
                  size={18}
                  className={
                    toast.tone === 'success'
                      ? 'text-(--color-accent)'
                      : 'text-(--color-text-secondary)'
                  }
                />
                <span className='min-w-0 flex-1'>{toast.message}</span>
                <button
                  type='button'
                  aria-label='Dismiss notification'
                  onClick={() => removeToast(toast.id)}
                  className='inline-flex size-7 shrink-0 items-center justify-center rounded-full text-(--color-text-secondary) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)'
                >
                  <X aria-hidden='true' size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </ModalContext.Provider>
    </ToastContext.Provider>
  );
};
