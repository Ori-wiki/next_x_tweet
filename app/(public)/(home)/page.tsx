import { EmptyState } from '@/src/shared/ui/EmptyState';
import { PageHero } from '@/src/shared/ui/PageHero';
import { TweetList } from '@/src/entities/tweet/ui/TweetList';
import { getSessionUser } from '@/src/entities/user/model/session';
import { getDictionary, resolveLanguage } from '@/src/shared/lib/i18n';
import { getTimeline } from '@/src/entities/tweet/model/selectors';
import { HomeSidebar } from './HomeSidebar';
import { TweetForm } from '@/src/features/create-tweet/ui/TweetForm';

export default async function HomePage() {
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { home, tweetForm } = getDictionary(language);
  const tweets = await getTimeline(currentUser);

  return (
    <div className='w-full'>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]'>
        <main className='min-w-0'>
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
        </main>
        <div className='sidebar-scroll hidden self-start lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'>
          <HomeSidebar currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
