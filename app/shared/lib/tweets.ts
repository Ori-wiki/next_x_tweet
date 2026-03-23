import { notFound } from 'next/navigation';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import type { TweetAuthor, TweetRecord, TweetView } from '@/app/shared/types/tweet.interface';
import type { SessionUser, UserRecord } from '@/app/shared/types/user.interface';

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

function toTweetView(tweet: TweetRecord, author: UserRecord, currentUserId?: string): TweetView {
  return {
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    hashtags: tweet.hashtags,
    likes: tweet.likedBy.length,
    bookmarks: tweet.bookmarkedBy.length,
    isLiked: currentUserId ? tweet.likedBy.includes(currentUserId) : false,
    isBookmarked: currentUserId ? tweet.bookmarkedBy.includes(currentUserId) : false,
    author: toTweetAuthor(author),
  };
}

export async function getTimeline(currentUser?: SessionUser | null) {
  const database = await readDemoDatabase();
  const usersById = new Map(database.users.map((user) => [user.id, user]));

  return database.tweets
    .slice()
    .sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .map((tweet) => {
      const author = usersById.get(tweet.authorId);

      if (!author) {
        throw new Error(`Unknown author for tweet ${tweet.id}`);
      }

      return toTweetView(tweet, author, currentUser?.id);
    });
}

export async function getUserProfile(username: string, currentUser?: SessionUser | null) {
  const database = await readDemoDatabase();
  const profile = database.users.find((user) => user.username === username);

  if (!profile) {
    notFound();
  }

  const tweets = database.tweets
    .filter((tweet) => tweet.authorId === profile.id)
    .sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .map((tweet) => toTweetView(tweet, profile, currentUser?.id));

  return { profile, tweets };
}

export async function getExploreData(params: { q?: string; tag?: string; currentUser?: SessionUser | null }) {
  const database = await readDemoDatabase();
  const usersById = new Map(database.users.map((user) => [user.id, user]));
  const normalizedQuery = params.q?.trim().toLowerCase() ?? '';
  const normalizedTag = params.tag?.trim().toLowerCase() ?? '';

  const tweets = database.tweets
    .filter((tweet) => {
      const author = usersById.get(tweet.authorId);
      if (!author) {
        return false;
      }

      const matchesQuery =
        !normalizedQuery ||
        tweet.content.toLowerCase().includes(normalizedQuery) ||
        author.name.toLowerCase().includes(normalizedQuery) ||
        author.username.toLowerCase().includes(normalizedQuery);
      const matchesTag =
        !normalizedTag || tweet.hashtags.includes(normalizedTag.replace(/^#/, ''));

      return matchesQuery && matchesTag;
    })
    .sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .map((tweet) => {
      const author = usersById.get(tweet.authorId);

      if (!author) {
        throw new Error(`Unknown author for tweet ${tweet.id}`);
      }

      return toTweetView(tweet, author, params.currentUser?.id);
    });

  const trends = [...database.tweets.flatMap((tweet) => tweet.hashtags)]
    .reduce<Map<string, number>>((accumulator, hashtag) => {
      accumulator.set(hashtag, (accumulator.get(hashtag) ?? 0) + 1);
      return accumulator;
    }, new Map())
    .entries();

  const sortedTrends = [...trends]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  return { tweets, trends: sortedTrends };
}

export async function getDashboardData(currentUser: SessionUser) {
  const timeline = await getTimeline(currentUser);

  return {
    latestTweets: timeline.slice(0, 3),
    likedTweets: timeline.filter((tweet) => tweet.isLiked),
    bookmarkedTweets: timeline.filter((tweet) => tweet.isBookmarked),
  };
}
