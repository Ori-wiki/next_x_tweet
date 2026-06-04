import type { Metadata } from 'next';
import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { ThreadReplyTree } from '@/app/components/ThreadReplyTree';
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
  const { tweet, ancestors, replies } = await getTweetThread(id, currentUser);

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow={thread.eyebrow}
        title={thread.title}
        description={thread.description}
      />

      {ancestors.length > 0 ? (
        <div className='space-y-3'>
          <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
            {thread.parentTweet}
          </p>
          <div className='space-y-4 border-l border-[var(--color-border)] pl-4 sm:pl-6'>
            {ancestors.map((ancestor) => (
              <Tweet
                key={ancestor.id}
                tweet={ancestor}
                canInteract={Boolean(currentUser)}
                language={language}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
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
        <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-text-subtle)]'>
          {thread.replies}
        </p>
        {replies.length > 0 ? (
          <ThreadReplyTree
            replies={replies}
            canInteract={Boolean(currentUser)}
            language={language}
          />
        ) : (
          <EmptyState message={thread.noReplies} />
        )}
      </div>
    </div>
  );
}
