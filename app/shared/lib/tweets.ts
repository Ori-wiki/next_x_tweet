import { notFound } from 'next/navigation';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import type {
  TweetAuthor,
  TweetRecord,
  TweetView,
} from '@/app/shared/types/tweet.interface';
import type { SessionUser, UserRecord } from '@/app/shared/types/user.interface';

type UsersById = Map<string, UserRecord>;
type TweetsById = Map<string, TweetRecord>;
type ReplyMap = Map<string, TweetRecord[]>;

interface TweetsContext {
  tweets: TweetRecord[];
  tweetsById: TweetsById;
  users: UserRecord[];
  usersById: UsersById;
  replyMap: ReplyMap;
}

const compareTweetsByDate = (left: TweetRecord, right: TweetRecord) =>
  new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

function indexById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function buildReplyMap(tweets: TweetRecord[]) {
  return tweets.reduce<ReplyMap>((accumulator, tweet) => {
    if (!tweet.replyToId) {
      return accumulator;
    }

    const replies = accumulator.get(tweet.replyToId) ?? [];
    replies.push(tweet);
    accumulator.set(tweet.replyToId, replies);
    return accumulator;
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

function getAuthorOrThrow(usersById: UsersById, tweet: TweetRecord) {
  const author = usersById.get(tweet.authorId);

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

function toTweetView(
  context: TweetsContext,
  tweet: TweetRecord,
  currentUserId?: string,
): TweetView {
  const author = getAuthorOrThrow(context.usersById, tweet);
  const replyTarget = tweet.replyToId ? context.tweetsById.get(tweet.replyToId) : null;
  const replyTargetAuthor =
    replyTarget ? context.usersById.get(replyTarget.authorId) ?? null : null;

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
    isReposted: currentUserId ? tweet.repostedBy.includes(currentUserId) : false,
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

function toTweetViews(
  context: TweetsContext,
  tweets: TweetRecord[],
  currentUserId?: string,
) {
  return tweets
    .slice()
    .sort(compareTweetsByDate)
    .map((tweet) => toTweetView(context, tweet, currentUserId));
}

function getTopTrends(tweets: TweetRecord[]) {
  const hashtagCounts = tweets.reduce<Map<string, number>>((accumulator, tweet) => {
    tweet.hashtags.forEach((hashtag) => {
      accumulator.set(hashtag, (accumulator.get(hashtag) ?? 0) + 1);
    });

    return accumulator;
  }, new Map());

  return [...hashtagCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);
}

function getProfileTabs(
  context: TweetsContext,
  profile: UserRecord,
  currentUser?: SessionUser | null,
) {
  const authoredTweets = context.tweets.filter((tweet) => tweet.authorId === profile.id);
  const likedTweets = context.tweets.filter((tweet) => tweet.likedBy.includes(profile.id));
  const mediaTweets = authoredTweets.filter((tweet) => tweet.media);

  return {
    posts: toTweetViews(context, authoredTweets, currentUser?.id),
    likes: toTweetViews(context, likedTweets, currentUser?.id),
    media: toTweetViews(context, mediaTweets, currentUser?.id),
  };
}

function getRelatedUsers(profile: UserRecord, users: UserRecord[]) {
  return users
    .filter((candidate) => candidate.id !== profile.id)
    .map((candidate) => {
      const sharedTopics = candidate.topics.filter((topic) =>
        profile.topics.includes(topic),
      );

      return {
        ...candidate,
        sharedTopics,
        score:
          sharedTopics.length * 2 +
          Number(profile.followingIds.includes(candidate.id)),
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function matchesExploreFilters(
  tweet: TweetRecord,
  author: UserRecord,
  normalizedQuery: string,
  normalizedTag: string,
) {
  const matchesQuery =
    !normalizedQuery ||
    tweet.content.toLowerCase().includes(normalizedQuery) ||
    author.name.toLowerCase().includes(normalizedQuery) ||
    author.username.toLowerCase().includes(normalizedQuery) ||
    author.topics.some((topic) => topic.includes(normalizedQuery));
  const matchesTag =
    !normalizedTag || tweet.hashtags.includes(normalizedTag.replace(/^#/, ''));

  return matchesQuery && matchesTag;
}

function getExploreScore(tweet: TweetRecord) {
  return (
    tweet.likedBy.length +
    tweet.bookmarkedBy.length +
    tweet.repostedBy.length +
    tweet.views / 1000
  );
}

function sortExploreTweets(tweets: TweetRecord[], sort: 'latest' | 'top') {
  if (sort === 'top') {
    return tweets.slice().sort((left, right) => getExploreScore(right) - getExploreScore(left));
  }

  return tweets.slice().sort(compareTweetsByDate);
}

function getMatchedAuthors(users: UserRecord[], normalizedQuery: string) {
  return users
    .filter((user) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.username.toLowerCase().includes(normalizedQuery) ||
        user.topics.some((topic) => topic.includes(normalizedQuery))
      );
    })
    .slice(0, 4);
}

function getExploreSuggestions(context: TweetsContext) {
  return [
    ...new Set(
      context.users.flatMap((user) => [
        user.username,
        ...user.topics,
        ...context.tweets.flatMap((tweet) => tweet.hashtags),
      ]),
    ),
  ].slice(0, 12);
}

async function loadTweetsContext() {
  const database = await readDemoDatabase();

  return {
    context: createTweetsContext(database.tweets, database.users),
    database,
  };
}

export async function getTimeline(currentUser?: SessionUser | null) {
  const { context } = await loadTweetsContext();
  return toTweetViews(context, context.tweets, currentUser?.id);
}

export async function getUserProfile(
  username: string,
  currentUser?: SessionUser | null,
) {
  const { context } = await loadTweetsContext();
  const profile = context.users.find((user) => user.username === username);

  if (!profile) {
    notFound();
  }

  return {
    profile,
    tabs: getProfileTabs(context, profile, currentUser),
    relatedUsers: getRelatedUsers(profile, context.users),
    isFollowing: currentUser ? currentUser.followingIds.includes(profile.id) : false,
  };
}

export async function getExploreData(params: {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
  currentUser?: SessionUser | null;
}) {
  const { context } = await loadTweetsContext();
  const normalizedQuery = params.q?.trim().toLowerCase() ?? '';
  const normalizedTag = params.tag?.trim().toLowerCase() ?? '';
  const filteredTweets = context.tweets.filter((tweet) => {
    const author = context.usersById.get(tweet.authorId);

    return author
      ? matchesExploreFilters(tweet, author, normalizedQuery, normalizedTag)
      : false;
  });
  const sortedTweets = sortExploreTweets(filteredTweets, params.sort ?? 'latest');

  return {
    tweets: toTweetViews(context, sortedTweets, params.currentUser?.id),
    trends: getTopTrends(context.tweets),
    matchedAuthors: getMatchedAuthors(context.users, normalizedQuery),
    matchedTags: getTopTrends(sortedTweets.length > 0 ? sortedTweets : context.tweets),
    suggestions: getExploreSuggestions(context),
  };
}

export async function getDashboardData(currentUser: SessionUser) {
  const timeline = await getTimeline(currentUser);

  return {
    latestTweets: timeline.slice(0, 3),
    likedTweets: timeline.filter((tweet) => tweet.isLiked),
    bookmarkedTweets: timeline.filter((tweet) => tweet.isBookmarked),
    repostedTweets: timeline.filter((tweet) => tweet.isReposted),
    mediaTweets: timeline.filter((tweet) => tweet.media),
  };
}

export async function getTweetThread(
  tweetId: string,
  currentUser?: SessionUser | null,
) {
  const { context } = await loadTweetsContext();
  const targetTweet = context.tweetsById.get(tweetId);

  if (!targetTweet) {
    notFound();
  }

  const parentTweet = targetTweet.replyToId
    ? context.tweetsById.get(targetTweet.replyToId) ?? null
    : null;
  const replies = context.replyMap.get(targetTweet.id) ?? [];

  return {
    tweet: toTweetView(context, targetTweet, currentUser?.id),
    parentTweet: parentTweet ? toTweetView(context, parentTweet, currentUser?.id) : null,
    replies: toTweetViews(context, replies, currentUser?.id),
  };
}
