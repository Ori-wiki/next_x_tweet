import Image from 'next/image';
import Link from 'next/link';
import { getSessionUser } from '@/src/entities/user/model/session';
import { ComposeModal } from '@/src/features/create-tweet';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { Menu } from '@/src/widgets/navigation/ui/Menu';
import { AuthControls } from './AuthControls';

export const Header = async () => {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { header, tweetForm } = getDictionary(language);

  return (
    <header className='sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-background-header)] backdrop-blur'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6'>
        <div className='flex items-center justify-between gap-4'>
          <Link className='flex min-w-0 items-center gap-3' href='/'>
            <Image
              src='/XTwitterW.svg'
              width={28}
              height={28}
              alt='X logo'
              priority
            />
            <div className='min-w-0'>
              <p className='hidden text-xs uppercase tracking-[0.2em] text-[var(--color-text-subtle)] sm:block'>
                {header.demoApp}
              </p>
              <p className='truncate font-semibold leading-5 text-[var(--color-text-primary)]'>
                Next X Tweet
              </p>
            </div>
          </Link>

          <div className='flex shrink-0 items-center justify-end gap-2'>
            <ComposeModal
              canCompose={Boolean(currentUser)}
              compact
              texts={{
                title: tweetForm.newTweet,
                submitLabel: tweetForm.postTweet,
                pendingLabel: tweetForm.posting,
                placeholder: tweetForm.placeholder,
                mediaUrlPlaceholder: tweetForm.mediaUrl,
                attachmentLabelPlaceholder: tweetForm.attachmentLabel,
              }}
            />
            <AuthControls />
          </div>
        </div>

        <Menu language={language} />
      </div>
    </header>
  );
};
