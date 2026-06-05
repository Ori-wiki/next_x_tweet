import { readDemoDatabase, updateDemoDatabase } from '@/src/shared/lib/demo-db';
import type { DemoDatabase } from '@/src/shared/lib/demo-db.types';
import type { SessionUser } from './types';
import { getSessionUserId } from './session';

export function findUserById(database: DemoDatabase, currentUserId?: string) {
  return database.users.find((user) => user.id === currentUserId);
}

export async function getDatabaseContext() {
  const currentUserId = await getSessionUserId();

  if (!currentUserId) {
    return null;
  }

  const database = await readDemoDatabase();
  const currentUser = findUserById(database, currentUserId);

  if (!currentUser) {
    return null;
  }

  return {
    currentUser,
    currentUserId,
    database,
  };
}

export async function withCurrentUser(
  callback: (context: {
    currentUser: SessionUser;
    currentUserId: string;
    database: DemoDatabase;
  }) => Promise<void>,
) {
  const context = await getDatabaseContext();

  if (!context) {
    return;
  }

  await callback(context);
}

export async function updateUsers(
  updater: DemoDatabase['users'] extends infer T
    ? T extends Array<infer U>
      ? (users: U[]) => U[]
      : never
    : never,
) {
  await updateDemoDatabase((draft) => ({
    ...draft,
    users: updater(draft.users),
  }));
}
