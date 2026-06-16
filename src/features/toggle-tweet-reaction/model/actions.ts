'use server';

import { z } from 'zod';
import {
  findTweetById,
  updateTweetRelation,
  updateTweets,
} from '@/entities/tweet';
import type { TweetRelationKey } from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';
import { formDataToObject } from '@/shared/lib/formData';

const tweetRelationSchema = z.object({
  tweetId: z.string().trim().min(1),
});

async function toggleTweetRelation(
  formData: FormData,
  relationKey: TweetRelationKey,
) {
  const parsed = tweetRelationSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return;
  }

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const { tweetId } = parsed.data;
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
