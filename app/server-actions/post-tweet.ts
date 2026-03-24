'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/app/shared/lib/auth';
import { readDemoDatabase, updateDemoDatabase } from '@/app/shared/lib/demo-db';
import { extractHashtags, tweetSchema } from '@/app/shared/lib/validation';
import type { DemoDatabase } from '@/app/shared/types/demo-db.interface';
import type { TweetRecord } from '@/app/shared/types/tweet.interface';
import type { TweetActionState } from './post-tweet.state';

function getCurrentUser(database: DemoDatabase, currentUserId?: string) {
  return database.users.find((user) => user.id === currentUserId);
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

function buildTweet(authorId: string, content: string): TweetRecord {
  return {
    id: crypto.randomUUID(),
    authorId,
    content,
    createdAt: new Date().toISOString(),
    hashtags: extractHashtags(content),
    likedBy: [],
    bookmarkedBy: [],
  };
}

function toggleUserRelation(userId: string, relatedUserIds: string[]) {
  return relatedUserIds.includes(userId)
    ? relatedUserIds.filter((relatedUserId) => relatedUserId !== userId)
    : [...relatedUserIds, userId];
}

function revalidateTweetSurfaces(username?: string) {
  revalidatePath('/');
  revalidatePath('/explore');
  revalidatePath('/profile-fake');

  if (username) {
    revalidatePath(`/u/${username}`);
  }
}

export async function createTweetAction(
  _previousState: TweetActionState,
  formData: FormData,
): Promise<TweetActionState> {
  const currentUserId = await getSessionUserId();

  if (!currentUserId) {
    return {
      status: 'error',
      message: 'Sign in with a demo account before posting.',
    };
  }

  const parsed = tweetSchema.safeParse({
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Review the tweet text and try again.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const database = await readDemoDatabase();
  const currentUser = getCurrentUser(database, currentUserId);

  if (!currentUser) {
    return {
      status: 'error',
      message: 'Your session expired. Sign in again.',
    };
  }

  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: [buildTweet(currentUser.id, parsed.data.content), ...draft.tweets],
  }));

  revalidateTweetSurfaces(currentUser.username);

  return {
    status: 'success',
    message: 'Tweet published.',
  };
}

async function toggleTweetRelation(
  formData: FormData,
  relationKey: 'likedBy' | 'bookmarkedBy',
) {
  const currentUserId = await getSessionUserId();
  const tweetId = String(formData.get('tweetId') ?? '');

  if (!currentUserId || !tweetId) {
    return;
  }

  const database = await readDemoDatabase();
  const currentUser = getCurrentUser(database, currentUserId);
  const targetTweet = database.tweets.find((tweet) => tweet.id === tweetId);

  if (!currentUser || !targetTweet) {
    return;
  }

  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: draft.tweets.map((tweet) => {
      if (tweet.id !== tweetId) {
        return tweet;
      }

      return {
        ...tweet,
        [relationKey]: toggleUserRelation(currentUserId, tweet[relationKey]),
      };
    }),
  }));

  revalidateTweetSurfaces(currentUser.username);
}

export async function toggleLikeAction(formData: FormData) {
  await toggleTweetRelation(formData, 'likedBy');
}

export async function toggleBookmarkAction(formData: FormData) {
  await toggleTweetRelation(formData, 'bookmarkedBy');
}

export async function deleteTweetAction(formData: FormData) {
  const currentUserId = await getSessionUserId();
  const tweetId = String(formData.get('tweetId') ?? '');

  if (!currentUserId || !tweetId) {
    return;
  }

  const database = await readDemoDatabase();
  const currentUser = getCurrentUser(database, currentUserId);
  const targetTweet = database.tweets.find((tweet) => tweet.id === tweetId);

  if (!currentUser || !targetTweet || targetTweet.authorId !== currentUserId) {
    return;
  }

  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: draft.tweets.filter((tweet) => tweet.id !== tweetId),
  }));

  revalidateTweetSurfaces(currentUser.username);
}

export async function loginAction(formData: FormData) {
  const userId = String(formData.get('userId') ?? '');
  const database = await readDemoDatabase();
  const user = database.users.find((candidate) => candidate.id === userId);

  if (!user) {
    redirect('/');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/profile-fake');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
