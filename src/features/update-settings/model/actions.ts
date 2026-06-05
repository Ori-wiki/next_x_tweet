'use server';

import { revalidateTweetSurfaces } from '@/src/entities/tweet/model/mutations';
import { ALLOWED_LANGUAGES } from '@/src/entities/user/config/preferences';
import { updateUsers, withCurrentUser } from '@/src/entities/user/model/mutations';
import type { UserLanguage } from '@/src/entities/user/model/types';

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

    await updateUsers((users) =>
      users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              settings,
            }
          : user,
      ),
    );

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
    });
  });
}
