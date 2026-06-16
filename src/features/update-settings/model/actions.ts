'use server';

import { z } from 'zod';
import { updateUsers, withCurrentUser } from '@/entities/user';
import { formDataToObject } from '@/shared/lib/formData';

const settingsSchema = z.object({
  language: z.enum(['en', 'ru']),
});

export async function updateSettingsAction(formData: FormData) {
  const parsed = settingsSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return;
  }

  await withCurrentUser(async ({ currentUser, currentUserId }) => {
    await updateUsers(
      (users) =>
        users.map((user) =>
          user.id === currentUserId
            ? {
                ...user,
                settings: parsed.data,
              }
            : user,
        ),
      {
        profileUsernames: [currentUser.username],
        revalidateSharedSurfaces: true,
      },
    );
  });
}
