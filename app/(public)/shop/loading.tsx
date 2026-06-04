export default function ShopLoading() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className='h-72 animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]'
        />
      ))}
    </div>
  );
}
