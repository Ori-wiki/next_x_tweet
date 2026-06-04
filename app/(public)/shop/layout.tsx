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
      <div className='rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6'>
        <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
          {shop.eyebrow}
        </p>
        <h1 className='mt-2 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl'>
          {shop.title}
        </h1>
        <p className='mt-3 max-w-2xl text-[var(--color-text-secondary)]'>{shop.description}</p>
      </div>
      <ShopLayoutShell language={language}>{children}</ShopLayoutShell>
    </div>
  );
}
