'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { readDemoDatabase, updateDemoDatabase } from '@/app/shared/lib/demo-db';
import { extractHashtags, tweetSchema } from '@/app/shared/lib/validation';
import { SESSION_COOKIE } from '@/app/shared/lib/auth';
import type { TweetActionState } from './post-tweet.state';

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
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!currentUserId) {
    return {
      status: 'error',
      message: 'Войди в демо-аккаунт, чтобы публиковать твиты.',
    };
  }

  const parsed = tweetSchema.safeParse({
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Проверь текст твита.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const database = await readDemoDatabase();
  const currentUser = database.users.find((user) => user.id === currentUserId);

  if (!currentUser) {
    return {
      status: 'error',
      message: 'Сессия устарела. Войди снова.',
    };
  }

  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: [
      {
        id: crypto.randomUUID(),
        authorId: currentUser.id,
        content: parsed.data.content,
        createdAt: new Date().toISOString(),
        hashtags: extractHashtags(parsed.data.content),
        likedBy: [],
        bookmarkedBy: [],
      },
      ...draft.tweets,
    ],
  }));

  revalidateTweetSurfaces(currentUser.username);

  return {
    status: 'success',
    message: 'Твит опубликован.',
  };
}

export async function toggleLikeAction(formData: FormData) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get(SESSION_COOKIE)?.value;
  const tweetId = String(formData.get('tweetId') ?? '');

  if (!currentUserId || !tweetId) {
    return;
  }

  const database = await readDemoDatabase();
  const currentUser = database.users.find((user) => user.id === currentUserId);
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

      const alreadyLiked = tweet.likedBy.includes(currentUserId);

      return {
        ...tweet,
        likedBy: alreadyLiked
          ? tweet.likedBy.filter((userId) => userId !== currentUserId)
          : [...tweet.likedBy, currentUserId],
      };
    }),
  }));

  revalidateTweetSurfaces(currentUser.username);
}

export async function toggleBookmarkAction(formData: FormData) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get(SESSION_COOKIE)?.value;
  const tweetId = String(formData.get('tweetId') ?? '');

  if (!currentUserId || !tweetId) {
    return;
  }

  const database = await readDemoDatabase();
  const currentUser = database.users.find((user) => user.id === currentUserId);
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

      const alreadyBookmarked = tweet.bookmarkedBy.includes(currentUserId);

      return {
        ...tweet,
        bookmarkedBy: alreadyBookmarked
          ? tweet.bookmarkedBy.filter((userId) => userId !== currentUserId)
          : [...tweet.bookmarkedBy, currentUserId],
      };
    }),
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
