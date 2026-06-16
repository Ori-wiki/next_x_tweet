'use server';

import {
  findTweetById,
  updateTweets,
} from '@/entities/tweet';
import type { TweetRecord } from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';
import { actionError, actionSuccess, type ActionResult } from '@/shared/lib/actionResult';
import { formDataToObject } from '@/shared/lib/formData';
import { deleteTweetSchema, tweetSnapshotSchema } from './schema';

export interface DeleteTweetPayload {
  deletedTweet?: TweetRecord;
}

export type DeleteTweetResult = ActionResult<DeleteTweetPayload>;

export async function deleteTweetAction(
  formData: FormData,
): Promise<DeleteTweetResult> {
  const parsed = deleteTweetSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionError();
  }

  let deletedTweet: TweetRecord | undefined;

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const { tweetId } = parsed.data;
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet || targetTweet.authorId !== currentUserId) {
      return;
    }

    deletedTweet = targetTweet;

    await updateTweets(
      (tweets) => tweets.filter((tweet) => tweet.id !== tweetId),
      {
        profileUsername: currentUser.username,
        tweetId: targetTweet.id,
        replyToId: targetTweet.replyToId,
      },
    );
  });

  return deletedTweet ? actionSuccess({ deletedTweet }) : actionError();
}

export async function restoreTweetAction(formData: FormData): Promise<ActionResult> {
  const rawTweet = String(formData.get('tweet') ?? '');
  let snapshot: unknown;

  try {
    snapshot = JSON.parse(rawTweet);
  } catch {
    return actionError();
  }

  const parsed = tweetSnapshotSchema.safeParse(snapshot);

  if (!parsed.success) {
    return actionError();
  }

  let restored = false;

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const restoredTweet = parsed.data;

    if (
      restoredTweet.authorId !== currentUserId ||
      findTweetById(database, restoredTweet.id)
    ) {
      return;
    }

    restored = true;

    await updateTweets(
      (tweets) => [restoredTweet, ...tweets],
      {
        profileUsername: currentUser.username,
        tweetId: restoredTweet.id,
        replyToId: restoredTweet.replyToId,
      },
    );
  });

  return restored ? actionSuccess() : actionError();
}
