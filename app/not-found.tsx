import Link from 'next/link';
import { getSessionUser } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';

export default async function NotFound() {
  const currentUser = await getSessionUser();
  const { common, notFound } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center text-(--color-text-primary)'>
      <div className='rounded-3xl border border-(--color-border) bg-(--color-surface) p-10'>
        <h1 className='mb-4 text-7xl font-bold'>404</h1>
        <p className='mb-6 max-w-md text-(--color-text-muted)'>
          {notFound.message}
        </p>
        <Link
          href='/'
          className='rounded-full bg-(--color-accent) px-4 py-2 font-semibold text-(--color-text-inverse) transition hover:bg-(--color-accent-hover)'
        >
          {common.backToHome}
        </Link>
      </div>
    </div>
  );
}
