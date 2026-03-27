import type { Metadata } from 'next';
import { EmptyState } from '@/app/components/EmptyState';
import { PageHero } from '@/app/components/PageHero';
import { Tweet } from '@/app/(public)/(home)/Tweet';
import { TweetForm } from '@/app/(public)/(home)/TweetForm';
import { getSessionUser } from '@/app/shared/lib/auth';
import { getTweetThread } from '@/app/shared/lib/tweets';

interface TweetPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TweetPageProps): Promise<Metadata> {
  const { id } = await params;
  const { tweet } = await getTweetThread(id);

  return {
    title: `Thread by ${tweet.author.name}`,
    description: tweet.content.slice(0, 120),
  };
}

export default async function TweetPage({ params }: TweetPageProps) {
  const { id } = await params;
  const currentUser = await getSessionUser();
  const { tweet, parentTweet, replies } = await getTweetThread(id, currentUser);

  return (
    <div className='space-y-6'>
      <PageHero
        eyebrow='Thread'
        title='Conversation view'
        description='Open the context, publish a reply and share this direct conversation link.'
      />

      {parentTweet ? (
        <div className='space-y-3'>
          <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
            Parent tweet
          </p>
          <Tweet tweet={parentTweet} canInteract={Boolean(currentUser)} />
        </div>
      ) : null}

      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          Focus tweet
        </p>
        <Tweet tweet={tweet} canInteract={Boolean(currentUser)} />
      </div>

      {currentUser ? (
        <TweetForm
          title='Reply to this thread'
          submitLabel='Post reply'
          replyToId={tweet.id}
          compact
        />
      ) : (
        <EmptyState message='Sign in with a demo account to reply inside this thread.' />
      )}

      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.2em] text-white/45'>
          Replies
        </p>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Tweet key={reply.id} tweet={reply} canInteract={Boolean(currentUser)} />
          ))
        ) : (
          <EmptyState message='No replies yet. Start the conversation with the composer above.' />
        )}
      </div>
    </div>
  );
}
