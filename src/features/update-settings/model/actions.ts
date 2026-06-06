'use server';

import { ALLOWED_LANGUAGES } from '@/shared/config/language';
import { updateUsers, withCurrentUser } from '@/entities/user';
import type { UserLanguage } from '@/entities/user';

function normalizeSettings(formData: FormData) {
  const language = String(formData.get('language') ?? '') as UserLanguage;

  if (!ALLOWED_LANGUAGES.has(language)) {
    return null;
  }

  return { language };
}

export async function updateSettingsAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId }) => {
    const settings = normalizeSettings(formData);

    if (!settings) {
      return;
    }

    await updateUsers(
      (users) =>
        users.map((user) =>
          user.id === currentUserId
            ? {
                ...user,
                settings,
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
