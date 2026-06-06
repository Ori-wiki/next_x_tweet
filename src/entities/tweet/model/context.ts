import { readDemoDatabase } from '@/shared/db';
import type { SessionUser, UserRecord } from '@/entities/user/@x/tweet';
import type {
  TweetAuthor,
  TweetRecord,
  TweetThreadNode,
  TweetView,
} from './types';

type UsersById = Map<string, UserRecord>;
type TweetsById = Map<string, TweetRecord>;
type ReplyMap = Map<string, TweetRecord[]>;

export interface TweetsContext {
  tweets: TweetRecord[];
  tweetsById: TweetsById;
  users: UserRecord[];
  usersById: UsersById;
  replyMap: ReplyMap;
}

export const compareTweetsByDate = (left: TweetRecord, right: TweetRecord) =>
  new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

const compareTweetsByDateAscending = (
  left: TweetRecord,
  right: TweetRecord,
) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

function indexById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function buildReplyMap(tweets: TweetRecord[]) {
  return tweets.reduce<ReplyMap>((replyMap, tweet) => {
    if (!tweet.replyToId) {
      return replyMap;
    }

    const replies = replyMap.get(tweet.replyToId) ?? [];
    replies.push(tweet);
    replyMap.set(tweet.replyToId, replies);
    return replyMap;
  }, new Map());
}

function createTweetsContext(
  tweets: TweetRecord[],
  users: UserRecord[],
): TweetsContext {
  return {
    tweets,
    tweetsById: indexById(tweets),
    users,
    usersById: indexById(users),
    replyMap: buildReplyMap(tweets),
  };
}

function getAuthor(context: TweetsContext, tweet: TweetRecord) {
  const author = context.usersById.get(tweet.authorId);

  if (!author) {
    throw new Error(`Unknown author for tweet ${tweet.id}`);
  }

  return author;
}

function toTweetAuthor(user: UserRecord): TweetAuthor {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    followers: user.followers,
    following: user.following,
    topics: user.topics,
  };
}

export function toTweetView(
  context: TweetsContext,
  tweet: TweetRecord,
  currentUserId?: string,
): TweetView {
  const author = getAuthor(context, tweet);
  const replyTarget = tweet.replyToId
    ? context.tweetsById.get(tweet.replyToId)
    : null;
  const replyTargetAuthor = replyTarget
    ? context.usersById.get(replyTarget.authorId) ?? null
    : null;

  return {
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    hashtags: tweet.hashtags,
    likes: tweet.likedBy.length,
    bookmarks: tweet.bookmarkedBy.length,
    reposts: tweet.repostedBy.length,
    views: tweet.views,
    repliesCount: context.replyMap.get(tweet.id)?.length ?? 0,
    isLiked: currentUserId ? tweet.likedBy.includes(currentUserId) : false,
    isBookmarked: currentUserId
      ? tweet.bookmarkedBy.includes(currentUserId)
      : false,
    isReposted: currentUserId
      ? tweet.repostedBy.includes(currentUserId)
      : false,
    isOwn: currentUserId === author.id,
    replyToId: tweet.replyToId,
    media: tweet.media ?? null,
    replyTo: replyTargetAuthor
      ? {
          username: replyTargetAuthor.username,
          name: replyTargetAuthor.name,
        }
      : null,
    author: toTweetAuthor(author),
  };
}

export function toTweetViews(
  context: TweetsContext,
  tweets: TweetRecord[],
  currentUserId?: string,
) {
  return tweets.map((tweet) => toTweetView(context, tweet, currentUserId));
}

export function buildReplyTree(
  context: TweetsContext,
  parentTweetId: string,
  currentUserId?: string,
  depth = 0,
): TweetThreadNode[] {
  const directReplies = (context.replyMap.get(parentTweetId) ?? [])
    .slice()
    .sort(compareTweetsByDateAscending);

  return directReplies.map((reply) => ({
    tweet: toTweetView(context, reply, currentUserId),
    depth,
    replies: buildReplyTree(context, reply.id, currentUserId, depth + 1),
  }));
}

export async function loadTweetsContext() {
  const database = await readDemoDatabase();
  return createTweetsContext(database.tweets, database.users);
}

export type { SessionUser, UserRecord };
