'use server';

import { updateUsers, withCurrentUser } from '@/entities/user';
import { actionError, actionSuccess, type ActionResult } from '@/shared/lib/actionResult';
import { formDataToObject } from '@/shared/lib/formData';
import { followSchema } from './schema';

export async function toggleFollowAction(formData: FormData): Promise<ActionResult> {
  const parsed = followSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionError();
  }

  let updated = false;

  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const { targetUserId } = parsed.data;

    if (currentUserId === targetUserId) {
      return;
    }

    const targetUser = database.users.find((user) => user.id === targetUserId);

    if (!targetUser) {
      return;
    }

    updated = true;
    const isFollowing = currentUser.followingIds.includes(targetUserId);

    await updateUsers(
      (users) =>
        users.map((user) => {
          if (user.id === currentUserId) {
            return {
              ...user,
              followingIds: isFollowing
                ? user.followingIds.filter((id) => id !== targetUserId)
                : [...user.followingIds, targetUserId],
              following: Math.max(0, user.following + (isFollowing ? -1 : 1)),
            };
          }

          if (user.id === targetUserId) {
            return {
              ...user,
              followers: Math.max(0, user.followers + (isFollowing ? -1 : 1)),
            };
          }

          return user;
        }),
      {
        profileUsernames: [currentUser.username, targetUser.username],
        revalidateSharedSurfaces: true,
      },
    );
  });

  return updated ? actionSuccess() : actionError();
}
