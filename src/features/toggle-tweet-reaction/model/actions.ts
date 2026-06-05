'use server';

import {
  findTweetById,
  revalidateTweetSurfaces,
  updateTweetRelation,
  updateTweets,
} from '@/src/entities/tweet/model/mutations';
import type { TweetRelationKey } from '@/src/entities/tweet/model/types';
import { withCurrentUser } from '@/src/entities/user/model/mutations';

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

    await updateTweets((tweets) =>
      updateTweetRelation(tweets, tweetId, currentUserId, relationKey),
    );

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
      tweetId: targetTweet.id,
      replyToId: targetTweet.replyToId,
    });
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
