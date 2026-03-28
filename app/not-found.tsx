import Link from 'next/link';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';

export default async function NotFound() {
  const currentUser = await getSessionUser();
  const { common, notFound } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center text-white'>
      <div className='rounded-[2rem] border border-white/10 bg-white/[0.03] p-10'>
        <h1 className='mb-4 text-7xl font-bold'>404</h1>
        <p className='mb-6 max-w-md text-white/65'>
          {notFound.message}
        </p>
        <Link
          href='/'
          className='rounded-full bg-sky-400 px-4 py-2 font-semibold text-black transition hover:bg-sky-300'
        >
          {common.backToHome}
        </Link>
      </div>
    </div>
  );
}
