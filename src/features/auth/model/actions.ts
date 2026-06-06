'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from '@/entities/user';
import { findUserById } from '@/entities/user';
import { readDemoDatabase } from '@/shared/db';

export async function loginAction(formData: FormData) {
  const userId = String(formData.get('userId') ?? '');
  const database = await readDemoDatabase();
  const user = findUserById(database, userId);

  if (!user) {
    redirect('/');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, SESSION_COOKIE_OPTIONS);

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
