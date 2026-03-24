import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { TweetList } from '@/app/components/TweetList';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getTimeline } from '@/app/shared/lib/tweets';
import { TweetForm } from './TweetForm';

export default async function HomePage() {
  const currentUser = await getSessionUser();
  const tweets = await getTimeline(currentUser);

  return (
    <div className='w-full'>
      <PageHero
        eyebrow='Home timeline'
        title='A small X clone with live actions and demo accounts'
        description='The feed is backed by local JSON storage, supports posting, likes, bookmarks, profile pages and protected routes.'
        className='mb-5'
      />

      {currentUser ? (
        <TweetForm />
      ) : (
        <div className='my-6'>
          <EmptyState message='Sign in with one of the demo accounts in the header to post, like and bookmark tweets.' />
        </div>
      )}

      <TweetList
        tweets={tweets}
        canInteract={Boolean(currentUser)}
        emptyMessage='No tweets are available yet.'
      />
    </div>
  );
}
