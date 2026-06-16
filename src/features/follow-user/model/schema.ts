import { z } from 'zod';

export const followSchema = z.object({
  targetUserId: z.string().trim().min(1),
});
