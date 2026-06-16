import { z } from 'zod';
import { createTweetSchema } from '@/entities/tweet';

export function createTweetActionSchema(language?: 'en' | 'ru') {
  return createTweetSchema(language).extend({
    replyToId: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || null),
  });
}
