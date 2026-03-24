import { notFound } from 'next/navigation';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import type {
  TweetAuthor,
  TweetRecord,
  TweetView,
} from '@/app/shared/types/tweet.interface';
import type { SessionUser, UserRecord } from '@/app/shared/types/user.interface';

const compareTweetsByDate = (left: TweetRecord, right: TweetRecord) =>
  new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

type UsersById = Map<string, UserRecord>;

function getUsersById(users: UserRecord[]): UsersById {
  return new Map(users.map((user) => [user.id, user]));
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
  };
}

function getAuthorOrThrow(usersById: Map<string, UserRecord>, tweet: TweetRecord) {
  const author = usersById.get(tweet.authorId);

  if (!author) {
    throw new Error(`Unknown author for tweet ${tweet.id}`);
  }

  return author;
}

function toTweetView(
  tweet: TweetRecord,
  author: UserRecord,
  currentUserId?: string,
): TweetView {
  return {
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    hashtags: tweet.hashtags,
    likes: tweet.likedBy.length,
    bookmarks: tweet.bookmarkedBy.length,
    isLiked: currentUserId ? tweet.likedBy.includes(currentUserId) : false,
    isBookmarked: currentUserId
      ? tweet.bookmarkedBy.includes(currentUserId)
      : false,
    isOwn: currentUserId === author.id,
    author: toTweetAuthor(author),
  };
}

function sortTweets(tweets: TweetRecord[]) {
  return tweets.slice().sort(compareTweetsByDate);
}

function filterTweetsWithAuthors(
  tweets: TweetRecord[],
  usersById: UsersById,
  predicate: (tweet: TweetRecord, author: UserRecord) => boolean,
) {
  return tweets.filter((tweet) => {
    const author = usersById.get(tweet.authorId);

    return author ? predicate(tweet, author) : false;
  });
}

function toTweetViews(
  tweets: TweetRecord[],
  usersById: UsersById,
  currentUserId?: string,
) {
  return sortTweets(tweets).map((tweet) =>
    toTweetView(tweet, getAuthorOrThrow(usersById, tweet), currentUserId),
  );
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

export async function getTimeline(currentUser?: SessionUser | null) {
  const database = await readDemoDatabase();
  const usersById = getUsersById(database.users);

  return toTweetViews(database.tweets, usersById, currentUser?.id);
}

export async function getUserProfile(
  username: string,
  currentUser?: SessionUser | null,
) {
  const database = await readDemoDatabase();
  const usersById = getUsersById(database.users);
  const profile = database.users.find((user) => user.username === username);

  if (!profile) {
    notFound();
  }

  const tweets = toTweetViews(
    database.tweets.filter((tweet) => tweet.authorId === profile.id),
    usersById,
    currentUser?.id,
  );

  return { profile, tweets };
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
    author.username.toLowerCase().includes(normalizedQuery);
  const matchesTag =
    !normalizedTag || tweet.hashtags.includes(normalizedTag.replace(/^#/, ''));

  return matchesQuery && matchesTag;
}

export async function getExploreData(params: {
  q?: string;
  tag?: string;
  currentUser?: SessionUser | null;
}) {
  const database = await readDemoDatabase();
  const usersById = getUsersById(database.users);
  const normalizedQuery = params.q?.trim().toLowerCase() ?? '';
  const normalizedTag = params.tag?.trim().toLowerCase() ?? '';

  const tweets = toTweetViews(
    filterTweetsWithAuthors(database.tweets, usersById, (tweet, author) =>
      matchesExploreFilters(tweet, author, normalizedQuery, normalizedTag),
    ),
    usersById,
    params.currentUser?.id,
  );

  return { tweets, trends: getTopTrends(database.tweets) };
}

export async function getDashboardData(currentUser: SessionUser) {
  const timeline = await getTimeline(currentUser);

  return {
    latestTweets: timeline.slice(0, 3),
    likedTweets: timeline.filter((tweet) => tweet.isLiked),
    bookmarkedTweets: timeline.filter((tweet) => tweet.isBookmarked),
  };
}
