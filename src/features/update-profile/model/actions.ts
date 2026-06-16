'use server';

import { updateUsers, withCurrentUser } from '@/entities/user';
import { formDataToObject } from '@/shared/lib/formData';
import { getDictionary, resolveLanguage } from '@/shared/lib/i18n';
import { createProfileSchema } from './schema';
import type { ProfileActionState } from './state';

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  let nextState: ProfileActionState = {
    status: 'error',
    message: '',
  };

  await withCurrentUser(async ({ currentUser, currentUserId }) => {
    const language = resolveLanguage(currentUser.settings);
    const { actions } = getDictionary(language);
    const parsed = createProfileSchema(language).safeParse(
      formDataToObject(formData),
    );

    if (!parsed.success) {
      nextState = {
        status: 'error',
        message: actions.reviewProfile,
        errors: parsed.error.flatten().fieldErrors,
      };
      return;
    }

    await updateUsers(
      (users) =>
        users.map((user) =>
          user.id === currentUserId
            ? {
                ...user,
                ...parsed.data,
              }
            : user,
        ),
      {
        profileUsernames: [currentUser.username],
        revalidateSharedSurfaces: true,
      },
    );

    nextState = {
      status: 'success',
      message: actions.profileUpdated,
    };
  });

  return nextState.message
    ? nextState
    : {
        status: 'error',
        message: getDictionary().actions.sessionExpired,
      };
}
