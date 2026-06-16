'use server';

import {
  buildTweet,
  findTweetById,
  updateTweets,
} from '@/entities/tweet';
import { extractHashtags } from '@/entities/tweet';
import { getDatabaseContext } from '@/entities/user';
import { formDataToObject } from '@/shared/lib/formData';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { createTweetActionSchema } from './schema';
import type { TweetActionState } from './state';

export async function createTweetAction(
  _previousState: TweetActionState,
  formData: FormData,
): Promise<TweetActionState> {
  const context = await getDatabaseContext();
  const language = resolveLanguage(context?.currentUser?.settings);
  const { actions } = getDictionary(language);

  if (!context) {
    return {
      status: 'error',
      message: actions.signInBeforePosting,
    };
  }

  const parsed = createTweetActionSchema(language).safeParse(
    formDataToObject(formData),
  );

  if (!parsed.success) {
    return {
      status: 'error',
      message: actions.reviewTweet,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { replyToId } = parsed.data;

  if (replyToId && !findTweetById(context.database, replyToId)) {
    return {
      status: 'error',
      message: actions.replyMissing,
    };
  }

  await updateTweets(
    (tweets) => [
      buildTweet(
        context.currentUser.id,
        parsed.data.content,
        extractHashtags(parsed.data.content),
        parsed.data.mediaUrl,
        parsed.data.attachmentLabel,
        replyToId,
      ),
      ...tweets,
    ],
    {
      profileUsername: context.currentUser.username,
      replyToId,
    },
  );

  return {
    status: 'success',
    message: actions.tweetPublished,
  };
}
