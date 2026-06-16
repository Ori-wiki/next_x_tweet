import { z } from 'zod';

export const settingsSchema = z.object({
  language: z.enum(['en', 'ru']),
});
