import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { getSessionUser } from '@/entities/user';
import { UserAvatar } from '@/entities/user/ui';
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
      <div className='mx-auto grid w-full max-w-7xl grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]'>
        <aside className='sticky top-0 flex h-screen flex-col items-center border-r border-(--color-border) bg-(--color-background) px-2 py-3 xl:items-stretch xl:px-4 xl:py-5'>
          <Link
            href={PAGES.HOME}
            className='mb-4 inline-flex size-12 items-center justify-center rounded-full transition hover:bg-(--color-surface-hover) xl:mb-5'
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

          <div className='mt-4 xl:hidden'>
            <ComposeModal
              compact
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

          <div className='mt-5 hidden xl:block'>
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
                className='flex items-center justify-center rounded-full p-1.5 transition hover:bg-(--color-surface-hover) xl:justify-start xl:gap-3 xl:px-3 xl:py-3'
              >
                <UserAvatar
                  src={currentUser.avatar}
                  alt={`${currentUser.name} avatar`}
                  sizes='40px'
                  className='size-10'
                />
                <div className='hidden min-w-0 xl:block'>
                  <p className='truncate text-sm font-bold'>
                    {currentUser.name}
                  </p>
                  <p className='truncate text-sm text-(--color-text-soft)'>
                    @{currentUser.username}
                  </p>
                </div>
              </Link>
            ) : (
              <div className='hidden xl:block'>
                <DemoRolePicker users={database.users} language={language} />
              </div>
            )}
          </div>
        </aside>

        <main className='min-w-0'>
          <div className='w-full px-2 py-3 sm:px-4 sm:py-6 xl:px-6 xl:py-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
