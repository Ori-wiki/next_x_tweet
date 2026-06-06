import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { getSessionUser } from '@/entities/user';
import { ComposeModal } from '@/features/create-tweet';
import { DemoRolePicker } from '@/features/auth';
import { PAGES } from '@/shared/config/pages';
import { readDemoDatabase } from '@/shared/db';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { getMenuItems } from '../model/menu.data';
import { SidebarNav } from './SidebarNav';

export const AppShell = async ({ children }: PropsWithChildren) => {
  const currentUser = await getSessionUser();
  const database = await readDemoDatabase();
  const language = resolveLanguage(currentUser?.settings);
  const { tweetForm } = getDictionary(language);
  const menuItems = getMenuItems(language);

  return (
    <div className='min-h-screen text-(--color-text-primary)'>
      <div className='mx-auto grid w-full max-w-7xl lg:grid-cols-[280px_minmax(0,1fr)]'>
        <aside className='sticky top-0 hidden h-screen border-r border-(--color-border) bg-(--color-background) px-4 py-5 lg:flex lg:flex-col'>
          <Link
            href={PAGES.HOME}
            className='mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-(--color-surface-hover)'
            aria-label='Home'
          >
            <Image
              src='/XTwitterW.svg'
              width={30}
              height={30}
              alt='X logo'
              priority
            />
          </Link>

          <SidebarNav items={menuItems} />

          <div className='mt-5'>
            <ComposeModal
              canCompose={Boolean(currentUser)}
              texts={{
                title: tweetForm.newTweet,
                submitLabel: tweetForm.postTweet,
                pendingLabel: tweetForm.posting,
                placeholder: tweetForm.placeholder,
                mediaUrlPlaceholder: tweetForm.mediaUrl,
                attachmentLabelPlaceholder: tweetForm.attachmentLabel,
              }}
            />
          </div>

          <div className='mt-auto'>
            {currentUser ? (
              <Link
                href={PAGES.PROFILE(currentUser.username)}
                className='flex items-center gap-3 rounded-full px-3 py-3 transition hover:bg-(--color-surface-hover)'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-(--color-surface-solid) text-sm font-bold text-(--color-text-inverse)'>
                  {currentUser.avatar}
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-bold'>
                    {currentUser.name}
                  </p>
                  <p className='truncate text-sm text-(--color-text-soft)'>
                    @{currentUser.username}
                  </p>
                </div>
              </Link>
            ) : (
              <DemoRolePicker users={database.users} language={language} />
            )}
          </div>
        </aside>

        <main className='min-w-0'>
          <div className='w-full px-4 py-6 sm:px-6 sm:py-8'>{children}</div>
        </main>
      </div>
    </div>
  );
};
