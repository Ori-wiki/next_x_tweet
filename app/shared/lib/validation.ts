import { z } from 'zod';

export const tweetSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Твит не может быть пустым.')
    .max(280, 'Максимум 280 символов.'),
});

export function extractHashtags(content: string) {
  return [...content.matchAll(/#([a-z0-9_]+)/gi)].map((match) =>
    match[1].toLowerCase(),
  );
}
