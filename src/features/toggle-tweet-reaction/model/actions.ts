'use server';

import {
  findTweetById,
  updateTweetRelation,
  updateTweets,
} from '@/entities/tweet';
import type { TweetRelationKey } from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';
import { actionError, actionSuccess, type ActionResult } from '@/shared/lib/actionResult';
import { formDataToObject } from '@/shared/lib/formData';
import { tweetRelationSchema } from './schema';

async function toggleTweetRelation(
  formData: FormData,
  relationKey: TweetRelationKey,
): Promise<ActionResult> {
  const parsed = tweetRelationSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionError();
  }

  let updated = false;

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const { tweetId } = parsed.data;
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet) {
      return;
    }

    updated = true;

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

  return updated ? actionSuccess() : actionError();
}

export async function toggleLikeAction(formData: FormData): Promise<ActionResult> {
  return toggleTweetRelation(formData, 'likedBy');
}

export async function toggleBookmarkAction(formData: FormData): Promise<ActionResult> {
  return toggleTweetRelation(formData, 'bookmarkedBy');
}

export async function toggleRepostAction(formData: FormData): Promise<ActionResult> {
  return toggleTweetRelation(formData, 'repostedBy');
}
