import type { Metadata } from 'next';
import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { Tweet } from '@/app/(public)/(home)/Tweet';
import { TweetForm } from '@/app/(public)/(home)/TweetForm';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { getTweetThread } from '@/app/shared/lib/tweets';

interface TweetPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TweetPageProps): Promise<Metadata> {
  const { id } = await params;
  const { tweet } = await getTweetThread(id);
  const currentUser = await getSessionUser();
  const { thread } = getDictionary(resolveLanguage(currentUser?.settings));

  return {
    title: `${thread.metadataTitle} ${tweet.author.name}`,
    description: tweet.content.slice(0, 120),
  };
}

export default async function TweetPage({ params }: TweetPageProps) {
  const { id } = await params;
  const currentUser = await getSessionUser();
  const language = resolveLanguage(currentUser?.settings);
  const { thread, tweetForm } = getDictionary(language);
  const { tweet, parentTweet, replies } = await getTweetThread(id, currentUser);

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow={thread.eyebrow}
        title={thread.title}
        description={thread.description}
      />

      {parentTweet ? (
        <div className='space-y-3'>
          <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
            {thread.parentTweet}
          </p>
          <Tweet
            tweet={parentTweet}
            canInteract={Boolean(currentUser)}
            language={language}
          />
        </div>
      ) : null}

      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          {thread.focusTweet}
        </p>
        <Tweet tweet={tweet} canInteract={Boolean(currentUser)} language={language} />
      </div>

      {currentUser ? (
        <TweetForm
          title={tweetForm.replyToThread}
          submitLabel={tweetForm.postReply}
          pendingLabel={tweetForm.posting}
          placeholder={tweetForm.placeholder}
          mediaUrlPlaceholder={tweetForm.mediaUrl}
          attachmentLabelPlaceholder={tweetForm.attachmentLabel}
          replyToId={tweet.id}
          compact
        />
      ) : (
        <EmptyState message={thread.signInToReply} />
      )}

      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          {thread.replies}
        </p>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Tweet
              key={reply.id}
              tweet={reply}
              canInteract={Boolean(currentUser)}
              language={language}
            />
          ))
        ) : (
          <EmptyState message={thread.noReplies} />
        )}
      </div>
    </div>
  );
}
