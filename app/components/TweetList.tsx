import { Tweet } from '@/app/(public)/(home)/Tweet';
import { PAGES } from '@/app/config/pages.config';
import type { TweetView } from '@/app/shared/types/tweet.interface';
import type { UserLanguage } from '@/app/shared/types/user.interface';
import { EmptyState } from './EmptyState';

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
