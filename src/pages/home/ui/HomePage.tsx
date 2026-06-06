import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHero } from '@/shared/ui/PageHero';
import { TweetList } from '@/widgets/tweet-feed';
import { getSessionUser } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { getTimeline } from '@/entities/tweet';
import { HomeSidebar } from './HomeSidebar';
import { TweetForm } from '@/features/create-tweet';

export default async function HomePage() {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { home, tweetForm } = getDictionary(language);
  const tweets = await getTimeline(currentUser);

  return (
    <div className='w-full'>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
        <div className='min-w-0'>
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
              <EmptyState
                message={home.signInEmpty}
                actionHref='/explore'
                actionLabel='Explore tweets'
              />
            </div>
          )}

          <TweetList
            tweets={tweets}
            canInteract={Boolean(currentUser)}
            emptyMessage={home.noTweets}
            language={language}
          />
        </div>
        <div className='sidebar-scroll hidden self-start lg:sticky lg:top-8 lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto'>
          <HomeSidebar currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
