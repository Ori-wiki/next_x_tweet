import { z } from 'zod';

export const tweetSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Tweet content cannot be empty.')
    .max(280, 'Tweet content must be 280 characters or fewer.'),
});

export function extractHashtags(content: string) {
  return [...content.matchAll(/#([a-z0-9_]+)/gi)].map((match) =>
    match[1].toLowerCase(),
  );
}
