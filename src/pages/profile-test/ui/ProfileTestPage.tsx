import type { Metadata } from 'next';

type Params = { username: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return {
    title: `@${(await params).username} test page`,
  };
}

export default async function TestPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;

  return (
    <div className='rounded-3xl border border-(--color-border) bg-(--color-surface-subtle) p-6 text-(--color-text-primary)'>
      <h1 className='mb-2 text-2xl font-bold'>Profile test route</h1>
      <p className='text-(--color-text-muted)'>Dynamic route check for @{username}</p>
    </div>
  );
}
