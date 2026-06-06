'use server';

import { updateUsers, withCurrentUser } from '@/entities/user';

export async function toggleFollowAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const targetUserId = String(formData.get('targetUserId') ?? '');

    if (!targetUserId || currentUserId === targetUserId) {
      return;
    }

    const targetUser = database.users.find((user) => user.id === targetUserId);

    if (!targetUser) {
      return;
    }

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
}
