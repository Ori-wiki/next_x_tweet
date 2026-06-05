import { Tweet } from '@/src/entities/tweet/ui/Tweet';
import { PAGES } from '@/src/shared/config/pages';
import type { TweetView } from '@/src/entities/tweet/model/types';
import type { UserLanguage } from '@/src/entities/user/model/types';
import { EmptyState } from '@/src/shared/ui/EmptyState';

interface TweetListProps {
  tweets: TweetView[];
  canInteract: boolean;
  emptyMessage: string;
  title?: string;
  language?: UserLanguage;
}

export const TweetList = ({
  tweets,
  canInteract,
  emptyMessage,
  title,
  language,
}: TweetListProps) => {
  return (
    <section className='space-y-5'>
      {title ? <h2 className='text-xl font-semibold text-[var(--color-text-primary)]'>{title}</h2> : null}
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweet={tweet}
            canInteract={canInteract}
            language={language}
          />
        ))
      ) : (
        <EmptyState
          message={emptyMessage}
          actionHref={PAGES.EXPLORE}
          actionLabel='Explore tweets'
        />
      )}
    </section>
  );
};
