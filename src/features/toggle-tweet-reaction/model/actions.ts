'use server';

import {
  findTweetById,
  updateTweetRelation,
  updateTweets,
} from '@/entities/tweet';
import type { TweetRelationKey } from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';

async function toggleTweetRelation(
  formData: FormData,
  relationKey: TweetRelationKey,
) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const tweetId = String(formData.get('tweetId') ?? '');
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet) {
      return;
    }

    await updateTweets(
      (tweets) =>
        updateTweetRelation(tweets, tweetId, currentUserId, relationKey),
      {
        profileUsername: currentUser.username,
        tweetId: targetTweet.id,
        replyToId: targetTweet.replyToId,
      },
    );
  });
}

export async function toggleLikeAction(formData: FormData) {
  await toggleTweetRelation(formData, 'likedBy');
}

export async function toggleBookmarkAction(formData: FormData) {
  await toggleTweetRelation(formData, 'bookmarkedBy');
}

export async function toggleRepostAction(formData: FormData) {
  await toggleTweetRelation(formData, 'repostedBy');
}
