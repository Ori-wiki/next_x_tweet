import type { SessionUser } from '@/entities/user/@x/tweet';
import {
  compareTweetsByDate,
  loadTweetsContext,
  toTweetViews,
} from './context';

export async function getTimeline(currentUser?: SessionUser | null) {
  const context = await loadTweetsContext();
  const tweets = context.tweets.slice().sort(compareTweetsByDate);
  return toTweetViews(context, tweets, currentUser?.id);
}
