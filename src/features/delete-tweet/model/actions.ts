'use server';

import { z } from 'zod';
import {
  findTweetById,
  updateTweets,
} from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';
import { formDataToObject } from '@/shared/lib/formData';

const deleteTweetSchema = z.object({
  tweetId: z.string().trim().min(1),
});

export async function deleteTweetAction(formData: FormData) {
  const parsed = deleteTweetSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return;
  }

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const { tweetId } = parsed.data;
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet || targetTweet.authorId !== currentUserId) {
      return;
    }

    await updateTweets(
      (tweets) => tweets.filter((tweet) => tweet.id !== tweetId),
      {
        profileUsername: currentUser.username,
        tweetId: targetTweet.id,
        replyToId: targetTweet.replyToId,
      },
    );
  });
}
