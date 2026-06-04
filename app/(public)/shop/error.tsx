'use client';

export default function ShopError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='rounded-3xl border border-[var(--color-danger-border)] bg-[var(--color-danger-surface)] p-6 text-[var(--color-danger-text)]'>
      <h2 className='text-xl font-semibold'>Failed to load products</h2>
      <p className='mt-2 text-sm text-[var(--color-danger-text-muted)]'>
        The external API did not respond or returned an error. Please try again.
      </p>
      <button
        type='button'
        onClick={reset}
        className='mt-4 rounded-full bg-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-danger-text)]'
      >
        Try again
      </button>
    </div>
  );
}
