import { z } from 'zod';
import { getDictionary } from '@/shared/lib/i18n';

export function createProfileSchema(language?: 'en' | 'ru') {
  const { validation } = getDictionary(language);

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, validation.profileNameMin)
      .max(50, validation.profileNameMax),
    bio: z
      .string()
      .trim()
      .max(160, validation.profileBioMax),
    avatar: z
      .string()
      .trim()
      .max(300, validation.profileAvatarMax)
      .refine(
        (value) => /^https?:\/\//i.test(value),
        validation.profileAvatarUrl,
      ),
  });
}
