import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readDemoDatabase } from '@/app/shared/lib/demo-db';
import type { SessionUser } from '@/app/shared/types/user.interface';

export const SESSION_COOKIE = 'demo_session';

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  const database = await readDemoDatabase();
  return database.users.find((user) => user.id === userId) ?? null;
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/');
  }

  return user;
}
