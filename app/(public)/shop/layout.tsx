import type { PropsWithChildren } from 'react';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { ShopLayoutShell } from './ShopLayoutShell';

export default async function Layout({ children }: PropsWithChildren<unknown>) {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { shop } = getDictionary(language);

  return (
    <div className='w-full space-y-5'>
      <div className='rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_45%),rgba(255,255,255,0.03)] p-6'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          {shop.eyebrow}
        </p>
        <h1 className='mt-2 text-2xl font-bold text-white sm:text-3xl'>
          {shop.title}
        </h1>
        <p className='mt-3 max-w-2xl text-white/70'>{shop.description}</p>
      </div>
      <ShopLayoutShell language={language}>{children}</ShopLayoutShell>
    </div>
  );
}
