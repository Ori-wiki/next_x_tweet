'use server';

import { updateUsers, withCurrentUser } from '@/entities/user';
import { actionError, actionSuccess, type ActionResult } from '@/shared/lib/actionResult';
import { formDataToObject } from '@/shared/lib/formData';
import { settingsSchema } from './schema';

export async function updateSettingsAction(formData: FormData): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionError();
  }

  let updated = false;

  await withCurrentUser(async ({ currentUser, currentUserId }) => {
    updated = true;

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

  return updated ? actionSuccess() : actionError();
}
