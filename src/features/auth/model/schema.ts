import { z } from 'zod';

export const loginSchema = z.object({
  userId: z.string().trim().min(1),
});
