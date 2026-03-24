'use client';

export default function ShopError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='rounded-3xl border border-rose-300/20 bg-rose-400/10 p-6 text-rose-100'>
      <h2 className='text-xl font-semibold'>Failed to load products</h2>
      <p className='mt-2 text-sm text-rose-100/80'>
        The external API did not respond or returned an error. Please try again.
      </p>
      <button
        type='button'
        onClick={reset}
        className='mt-4 rounded-full bg-rose-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-rose-200'
      >
        Try again
      </button>
    </div>
  );
}
