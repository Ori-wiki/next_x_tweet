import { TweetSkeleton } from '@/src/entities/tweet/ui/TweetSkeleton';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';

export default async function DashboardLoading() {
  const currentUser = await getSessionUser();
  const { dashboard } = getDictionary(resolveLanguage(currentUser?.settings));

  return (
    <div className='space-y-5'>
      <div className='skeleton h-56 rounded-[2rem]' />
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='skeleton h-32 rounded-3xl' />
        <div className='skeleton h-32 rounded-3xl' />
        <div className='skeleton h-32 rounded-3xl' />
      </div>
      <p className='text-sm text-[var(--color-text-soft)]'>{dashboard.loadingTitle}</p>
      <TweetSkeleton />
    </div>
  );
}
