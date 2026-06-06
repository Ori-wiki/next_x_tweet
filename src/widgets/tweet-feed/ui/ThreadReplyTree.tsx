import { Tweet } from './Tweet';
import type { TweetThreadNode } from '@/entities/tweet';
import type { UserLanguage } from '@/entities/user';

interface ThreadReplyTreeProps {
  replies: TweetThreadNode[];
  canInteract: boolean;
  language?: UserLanguage;
}

export const ThreadReplyTree = ({
  replies,
  canInteract,
  language,
}: ThreadReplyTreeProps) => {
  return (
    <div className='space-y-4'>
      {replies.map((reply) => (
        <ThreadReplyBranch
          key={reply.tweet.id}
          node={reply}
          canInteract={canInteract}
          language={language}
        />
      ))}
    </div>
  );
};

interface ThreadReplyBranchProps {
  node: TweetThreadNode;
  canInteract: boolean;
  language?: UserLanguage;
}

const ThreadReplyBranch = ({
  node,
  canInteract,
  language,
}: ThreadReplyBranchProps) => {
  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <div className='flex w-5 justify-center'>
          {node.depth > 0 ? (
            <span className='mt-3 h-full min-h-12 w-px rounded-full bg-[var(--color-surface-raised)]' />
          ) : null}
        </div>
        <div className='min-w-0 flex-1'>
          <Tweet tweet={node.tweet} canInteract={canInteract} language={language} />
        </div>
      </div>

      {node.replies.length > 0 ? (
        <div className='ml-3 border-l border-[var(--color-border)] pl-4 sm:ml-6 sm:pl-5'>
          <ThreadReplyTree
            replies={node.replies}
            canInteract={canInteract}
            language={language}
          />
        </div>
      ) : null}
    </div>
  );
};
