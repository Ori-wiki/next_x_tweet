import { z } from 'zod';

export const tweetRelationSchema = z.object({
  tweetId: z.string().trim().min(1),
});
