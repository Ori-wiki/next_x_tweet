import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readDemoDatabase } from '@/shared/db';
import type { SessionUser } from './types';

export const SESSION_COOKIE = 'demo_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const userId = await getSessionUserId();

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
