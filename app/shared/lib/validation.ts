import { z } from 'zod';

export const tweetSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Tweet content cannot be empty.')
    .max(280, 'Tweet content must be 280 characters or fewer.'),
  mediaUrl: z
    .string()
    .trim()
    .max(300, 'Media URL must be 300 characters or fewer.')
    .optional()
    .transform((value) => value ?? '')
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      'Media URL must start with http:// or https://.',
    ),
  attachmentLabel: z
    .string()
    .trim()
    .max(80, 'Attachment label must be 80 characters or fewer.')
    .optional()
    .transform((value) => value ?? ''),
});

export function extractHashtags(content: string) {
  return [...content.matchAll(/#([a-z0-9_]+)/gi)].map((match) =>
    match[1].toLowerCase(),
  );
}
