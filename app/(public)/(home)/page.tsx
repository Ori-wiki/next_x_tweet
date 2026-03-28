import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { TweetList } from '@/app/components/TweetList';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getTimeline } from '@/app/shared/lib/tweets';
import { TweetForm } from './TweetForm';

export default async function HomePage() {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { home, tweetForm } = getDictionary(language);
  const tweets = await getTimeline(currentUser);

  return (
    <div className='w-full'>
      <PageHero
        eyebrow={home.eyebrow}
        title={home.title}
        description={home.description}
        className='mb-5'
      />

      {currentUser ? (
        <TweetForm
          title={tweetForm.newTweet}
          submitLabel={tweetForm.postTweet}
          pendingLabel={tweetForm.posting}
          placeholder={tweetForm.placeholder}
          mediaUrlPlaceholder={tweetForm.mediaUrl}
          attachmentLabelPlaceholder={tweetForm.attachmentLabel}
        />
      ) : (
        <div className='my-6'>
          <EmptyState message={home.signInEmpty} />
        </div>
      )}

      <TweetList
        tweets={tweets}
        canInteract={Boolean(currentUser)}
        emptyMessage={home.noTweets}
        language={language}
      />
    </div>
  );
}
