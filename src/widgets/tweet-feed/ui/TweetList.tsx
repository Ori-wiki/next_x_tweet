import { Tweet } from './Tweet';
import { PAGES } from '@/shared/config/pages';
import type { TweetView } from '@/entities/tweet';
import type { UserLanguage } from '@/entities/user';
import { EmptyState } from '@/shared/ui/EmptyState';

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
    <section className='space-y-3 sm:space-y-5'>
      {title ? <h2 className='text-xl font-semibold text-(--color-text-primary)'>{title}</h2> : null}
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
