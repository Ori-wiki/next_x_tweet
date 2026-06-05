'use server';

import {
  findTweetById,
  revalidateTweetSurfaces,
  updateTweets,
} from '@/src/entities/tweet/model/mutations';
import { withCurrentUser } from '@/src/entities/user/model/mutations';

export async function deleteTweetAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const tweetId = String(formData.get('tweetId') ?? '');
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet || targetTweet.authorId !== currentUserId) {
      return;
    }

    await updateTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId));

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
      tweetId: targetTweet.id,
      replyToId: targetTweet.replyToId,
    });
  });
}
