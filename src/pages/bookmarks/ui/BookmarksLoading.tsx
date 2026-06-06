import { TweetSkeleton } from '@/entities/tweet';
import { getDictionary } from '@/shared/lib/i18n';

export default function BookmarksLoading() {
  const { bookmarks } = getDictionary();

  return (
    <div className='space-y-5'>
      <div className='skeleton h-40 rounded-3xl' />
      <p className='text-sm text-(--color-text-soft)'>{bookmarks.loadingTitle}</p>
      <TweetSkeleton />
      <TweetSkeleton />
    </div>
  );
}
