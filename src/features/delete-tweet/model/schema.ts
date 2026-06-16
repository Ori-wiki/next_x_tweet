import { z } from 'zod';
import type { TweetRecord } from '@/entities/tweet';

export const deleteTweetSchema = z.object({
  tweetId: z.string().trim().min(1),
});

export const tweetSnapshotSchema = z.object({
  id: z.string().trim().min(1),
  authorId: z.string().trim().min(1),
  content: z.string(),
  createdAt: z.string().trim().min(1),
  hashtags: z.array(z.string()),
  likedBy: z.array(z.string()),
  bookmarkedBy: z.array(z.string()),
  repostedBy: z.array(z.string()),
  views: z.number().int().nonnegative(),
  replyToId: z.string().nullable(),
  media: z
    .object({
      url: z.string(),
      type: z.enum(['image', 'link']),
      title: z.string().optional(),
      description: z.string().optional(),
      attachmentLabel: z.string().optional(),
    })
    .nullable()
    .optional(),
}) satisfies z.ZodType<TweetRecord>;
