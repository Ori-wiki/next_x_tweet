'use server';

import {
  findTweetById,
  updateTweets,
} from '@/entities/tweet';
import { withCurrentUser } from '@/entities/user';

export async function deleteTweetAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const tweetId = String(formData.get('tweetId') ?? '');
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
