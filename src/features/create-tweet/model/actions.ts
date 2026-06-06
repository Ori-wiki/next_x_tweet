'use server';

import {
  buildTweet,
  findTweetById,
  updateTweets,
} from '@/entities/tweet';
import { createTweetSchema, extractHashtags } from '@/entities/tweet';
import { getDatabaseContext } from '@/entities/user';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
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

  const parsed = createTweetSchema(language).safeParse({
    content: formData.get('content'),
    mediaUrl: formData.get('mediaUrl'),
    attachmentLabel: formData.get('attachmentLabel'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: actions.reviewTweet,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const replyToId = String(formData.get('replyToId') ?? '').trim() || null;

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
