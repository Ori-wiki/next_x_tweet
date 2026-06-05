import { TweetSkeleton } from '@/src/entities/tweet/ui/TweetSkeleton';
import { getDictionary } from '@/src/shared/lib/i18n';

export default function NotificationsLoading() {
  const { notifications } = getDictionary();

  return (
    <div className='space-y-5'>
      <div className='skeleton h-40 rounded-[24px]' />
      <p className='text-sm text-[var(--color-text-soft)]'>
        {notifications.loadingTitle}
      </p>
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
