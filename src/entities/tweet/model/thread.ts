import { notFound } from 'next/navigation';
import type { SessionUser } from '@/entities/user/@x/tweet';
import {
  buildReplyTree,
  loadTweetsContext,
  toTweetView,
  type TweetsContext,
} from './context';
import type { TweetRecord } from './types';

function getAncestors(context: TweetsContext, tweet: TweetRecord) {
  const ancestors: TweetRecord[] = [];
  let parentId = tweet.replyToId;

  while (parentId) {
    const parent = context.tweetsById.get(parentId);

    if (!parent) {
      break;
    }

    ancestors.unshift(parent);
    parentId = parent.replyToId;
  }

  return ancestors;
}

export async function getTweetThread(
  tweetId: string,
  currentUser?: SessionUser | null,
) {
  const context = await loadTweetsContext();
  const targetTweet = context.tweetsById.get(tweetId);

  if (!targetTweet) {
    notFound();
  }

  return {
    tweet: toTweetView(context, targetTweet, currentUser?.id),
    ancestors: getAncestors(context, targetTweet).map((ancestor) =>
      toTweetView(context, ancestor, currentUser?.id),
    ),
    replies: buildReplyTree(context, targetTweet.id, currentUser?.id),
  };
}
