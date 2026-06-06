import { z } from 'zod';
import { getDictionary } from '@/shared/lib/i18n';

export function createTweetSchema(language?: 'en' | 'ru') {
  const { validation } = getDictionary(language);

  return z.object({
    content: z
      .string()
      .trim()
      .min(1, validation.emptyTweet)
      .max(280, validation.maxTweet),
    mediaUrl: z
      .string()
      .trim()
      .max(300, validation.maxMediaUrl)
      .optional()
      .transform((value) => value ?? '')
      .refine(
        (value) => !value || /^https?:\/\//i.test(value),
        validation.invalidMediaUrl,
      ),
    attachmentLabel: z
      .string()
      .trim()
      .max(80, validation.maxAttachmentLabel)
      .optional()
      .transform((value) => value ?? ''),
  });
}

export const tweetSchema = createTweetSchema();

export function extractHashtags(content: string) {
  return [...content.matchAll(/#([a-z0-9_]+)/gi)].map((match) =>
    match[1].toLowerCase(),
  );
}
