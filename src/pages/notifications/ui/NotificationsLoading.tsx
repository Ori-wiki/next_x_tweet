import { TweetSkeleton } from '@/entities/tweet';
import { getDictionary } from '@/shared/lib/i18n';

export default function NotificationsLoading() {
  const { notifications } = getDictionary();

  return (
    <div className='space-y-5'>
      <div className='skeleton h-40 rounded-3xl' />
      <p className='text-sm text-(--color-text-soft)'>
        {notifications.loadingTitle}
      </p>
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
