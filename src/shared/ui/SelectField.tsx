'use client';

import { ChevronDown } from 'lucide-react';
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type OptionHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/src/shared/lib/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  children: ReactNode;
  className?: string;
  defaultValue?: string;
  name: string;
}

function getOptions(children: ReactNode) {
  return Children.toArray(children).reduce<SelectOption[]>((options, child) => {
    if (!isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child)) {
      return options;
    }

    const value = String(child.props.value ?? '');
    const label = typeof child.props.children === 'string'
      ? child.props.children
      : value;

    return [...options, { label, value }];
  }, []);
}

export const SelectField = ({
  children,
  className,
  defaultValue,
  name,
}: SelectFieldProps) => {
  const options = getOptions(children);
  const initialValue = defaultValue ?? options[0]?.value ?? '';
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <span ref={rootRef} className='relative block w-full'>
      <input type='hidden' name={name} value={value} />
      <button
        type='button'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-3 text-left',
          className,
          isOpen && 'rounded-b-none border-b-0',
        )}
      >
        <span className='min-w-0 truncate'>{selectedOption?.label}</span>
        <ChevronDown
          aria-hidden='true'
          size={18}
          className={cn(
            'shrink-0 text-[var(--color-text-soft)] transition-transform duration-150',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role='listbox'
          className='absolute left-0 right-0 top-full z-30 overflow-hidden rounded-b-2xl border border-t-0 border-[var(--color-accent)] bg-[var(--color-surface-dark-medium)] py-1 shadow-[var(--shadow-card)]'
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type='button'
                role='option'
                aria-selected={isSelected}
                onClick={() => {
                  setValue(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'block w-full cursor-pointer px-4 py-2.5 text-left text-sm transition hover:bg-[var(--color-surface-hover)]',
                  isSelected
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </span>
  );
};
