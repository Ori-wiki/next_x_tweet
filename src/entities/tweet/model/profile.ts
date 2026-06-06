import { notFound } from 'next/navigation';
import type { SessionUser, UserRecord } from '@/entities/user/@x/tweet';
import {
  loadTweetsContext,
  toTweetViews,
  type TweetsContext,
} from './context';

function getProfileTabs(
  context: TweetsContext,
  profile: UserRecord,
  currentUser?: SessionUser | null,
) {
  const authoredTweets = context.tweets.filter(
    (tweet) => tweet.authorId === profile.id,
  );
  const likedTweets = context.tweets.filter((tweet) =>
    tweet.likedBy.includes(profile.id),
  );

  return {
    posts: toTweetViews(context, authoredTweets, currentUser?.id),
    likes: toTweetViews(context, likedTweets, currentUser?.id),
    media: toTweetViews(
      context,
      authoredTweets.filter((tweet) => tweet.media),
      currentUser?.id,
    ),
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

export async function getUserProfile(
  username: string,
  currentUser?: SessionUser | null,
) {
  const context = await loadTweetsContext();
  const profile = context.users.find((user) => user.username === username);

  if (!profile) {
    notFound();
  }

  return {
    profile,
    tabs: getProfileTabs(context, profile, currentUser),
    relatedUsers: getRelatedUsers(profile, context.users),
    isFollowing: currentUser
      ? currentUser.followingIds.includes(profile.id)
      : false,
  };
}
