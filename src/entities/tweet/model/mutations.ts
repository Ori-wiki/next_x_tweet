import { revalidatePath } from 'next/cache';
import { updateDemoDatabase } from '@/src/shared/lib/demo-db';
import type { DemoDatabase } from '@/src/shared/lib/demo-db.types';
import type { TweetMedia, TweetRecord, TweetRelationKey } from './types';

export function findTweetById(database: DemoDatabase, tweetId: string) {
  return database.tweets.find((tweet) => tweet.id === tweetId);
}

function detectMediaType(url: string): TweetMedia['type'] {
  return /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url) ? 'image' : 'link';
}

export function buildMedia(mediaUrl: string, attachmentLabel: string): TweetMedia | null {
  if (!mediaUrl) {
    return null;
  }

  const type = detectMediaType(mediaUrl);

  return {
    url: mediaUrl,
    type,
    title: type === 'image' ? 'Attached image' : attachmentLabel || 'Shared link',
    description:
      type === 'image'
        ? 'Attached from the composer.'
        : 'Tap to open the shared resource in a new tab.',
    attachmentLabel: attachmentLabel || undefined,
  };
}

export function buildTweet(
  authorId: string,
  content: string,
  hashtags: string[],
  mediaUrl = '',
  attachmentLabel = '',
  replyToId: string | null = null,
): TweetRecord {
  return {
    id: crypto.randomUUID(),
    authorId,
    content,
    createdAt: new Date().toISOString(),
    hashtags,
    likedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    views: Math.floor(Math.random() * 800) + 120,
    replyToId,
    media: buildMedia(mediaUrl, attachmentLabel),
  };
}

function toggleUserRelation(userId: string, relatedUserIds: string[]) {
  return relatedUserIds.includes(userId)
    ? relatedUserIds.filter((relatedUserId) => relatedUserId !== userId)
    : [...relatedUserIds, userId];
}

export function updateTweetRelation(
  tweets: TweetRecord[],
  tweetId: string,
  currentUserId: string,
  relationKey: TweetRelationKey,
) {
  return tweets.map((tweet) => {
    if (tweet.id !== tweetId) {
      return tweet;
    }

    return {
      ...tweet,
      [relationKey]: toggleUserRelation(currentUserId, tweet[relationKey]),
    };
  });
}

export async function updateTweets(
  updater: (tweets: TweetRecord[]) => TweetRecord[],
) {
  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: updater(draft.tweets),
  }));
}

export function revalidateTweetSurfaces({
  profileUsername,
  tweetId,
  replyToId,
}: {
  profileUsername?: string;
  tweetId?: string;
  replyToId?: string | null;
}) {
  revalidatePath('/');
  revalidatePath('/explore');
  revalidatePath('/dashboard');

  if (profileUsername) {
    revalidatePath(`/u/${profileUsername}`);
  }

  if (tweetId) {
    revalidatePath(`/tweet/${tweetId}`);
  }

  if (replyToId) {
    revalidatePath(`/tweet/${replyToId}`);
  }
}
