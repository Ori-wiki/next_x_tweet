import type { SessionUser, UserRecord } from '@/entities/user/@x/tweet';
import {
  compareTweetsByDate,
  loadTweetsContext,
  toTweetViews,
  type TweetsContext,
} from './context';
import type { TweetRecord } from './types';

function normalizeSearchValue(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function getTopTrends(tweets: TweetRecord[]) {
  const counts = tweets.reduce<Map<string, number>>((result, tweet) => {
    tweet.hashtags.forEach((hashtag) => {
      result.set(hashtag, (result.get(hashtag) ?? 0) + 1);
    });
    return result;
  }, new Map());

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);
}

function matchesFilters(
  tweet: TweetRecord,
  author: UserRecord,
  query: string,
  tag: string,
) {
  const normalizedTag = tag.replace(/^#/, '');
  const matchesQuery =
    !query ||
    tweet.content.toLowerCase().includes(query) ||
    author.name.toLowerCase().includes(query) ||
    author.username.toLowerCase().includes(query) ||
    author.topics.some((topic) => topic.toLowerCase().includes(query));
  const matchesTag =
    !tag ||
    tweet.hashtags.some(
      (hashtag) => hashtag.toLowerCase() === normalizedTag,
    );

  return matchesQuery && matchesTag;
}

function getEngagementScore(tweet: TweetRecord) {
  return (
    tweet.likedBy.length +
    tweet.bookmarkedBy.length +
    tweet.repostedBy.length +
    tweet.views / 1000
  );
}

function sortTweets(tweets: TweetRecord[], sort: 'latest' | 'top') {
  return tweets.slice().sort(
    sort === 'top'
      ? (left, right) => getEngagementScore(right) - getEngagementScore(left)
      : compareTweetsByDate,
  );
}

function getMatchedAuthors(users: UserRecord[], query: string) {
  return users
    .filter(
      (user) =>
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.topics.some((topic) => topic.toLowerCase().includes(query)),
    )
    .slice(0, 4);
}

function getSuggestions(context: TweetsContext) {
  return [
    ...new Set([
      ...context.users.flatMap((user) => [user.username, ...user.topics]),
      ...context.tweets.flatMap((tweet) => tweet.hashtags),
    ]),
  ].slice(0, 12);
}

export async function getExploreData(params: {
  q?: string;
  tag?: string;
  sort?: 'latest' | 'top';
  currentUser?: SessionUser | null;
}) {
  const context = await loadTweetsContext();
  const query = normalizeSearchValue(params.q);
  const tag = normalizeSearchValue(params.tag);
  const filteredTweets = context.tweets.filter((tweet) => {
    const author = context.usersById.get(tweet.authorId);
    return author ? matchesFilters(tweet, author, query, tag) : false;
  });
  const tweets = sortTweets(filteredTweets, params.sort ?? 'latest');

  return {
    tweets: toTweetViews(context, tweets, params.currentUser?.id),
    trends: getTopTrends(context.tweets),
    matchedAuthors: getMatchedAuthors(context.users, query),
    matchedTags: getTopTrends(
      tweets.length > 0 ? tweets : context.tweets,
    ),
    suggestions: getSuggestions(context),
  };
}
