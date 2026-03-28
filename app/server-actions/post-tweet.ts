'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ALLOWED_LANGUAGES } from '@/app/config/preferences.config';
import { SESSION_COOKIE } from '@/app/shared/lib/auth';
import { readDemoDatabase, updateDemoDatabase } from '@/app/shared/lib/demo-db';
import { getDictionary, resolveLanguage } from '@/app/shared/lib/i18n';
import { createTweetSchema, extractHashtags } from '@/app/shared/lib/validation';
import type { DemoDatabase } from '@/app/shared/types/demo-db.interface';
import type {
  TweetMedia,
  TweetRecord,
  TweetRelationKey,
} from '@/app/shared/types/tweet.interface';
import type {
  SessionUser,
  UserLanguage,
} from '@/app/shared/types/user.interface';
import type { TweetActionState } from './post-tweet.state';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

function findUserById(database: DemoDatabase, currentUserId?: string) {
  return database.users.find((user) => user.id === currentUserId);
}

function findTweetById(database: DemoDatabase, tweetId: string) {
  return database.tweets.find((tweet) => tweet.id === tweetId);
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

async function getDatabaseContext() {
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

function detectMediaType(url: string): TweetMedia['type'] {
  return /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url) ? 'image' : 'link';
}

function buildMedia(mediaUrl: string, attachmentLabel: string): TweetMedia | null {
  if (!mediaUrl) {
    return null;
  }

  const type = detectMediaType(mediaUrl);

  return {
    url: mediaUrl,
    type,
    title: type === 'image' ? 'Attached image' : attachmentLabel || 'Shared link',
    description:
      type === 'image'
        ? 'Attached from the composer.'
        : 'Tap to open the shared resource in a new tab.',
    attachmentLabel: attachmentLabel || undefined,
  };
}

function buildTweet(
  authorId: string,
  content: string,
  mediaUrl = '',
  attachmentLabel = '',
  replyToId: string | null = null,
): TweetRecord {
  return {
    id: crypto.randomUUID(),
    authorId,
    content,
    createdAt: new Date().toISOString(),
    hashtags: extractHashtags(content),
    likedBy: [],
    bookmarkedBy: [],
    repostedBy: [],
    views: Math.floor(Math.random() * 800) + 120,
    replyToId,
    media: buildMedia(mediaUrl, attachmentLabel),
  };
}

function toggleUserRelation(userId: string, relatedUserIds: string[]) {
  return relatedUserIds.includes(userId)
    ? relatedUserIds.filter((relatedUserId) => relatedUserId !== userId)
    : [...relatedUserIds, userId];
}

function revalidateTweetSurfaces({
  profileUsername,
  tweetId,
  replyToId,
}: {
  profileUsername?: string;
  tweetId?: string;
  replyToId?: string | null;
}) {
  revalidatePath('/');
  revalidatePath('/explore');
  revalidatePath('/profile-fake');

  if (profileUsername) {
    revalidatePath(`/u/${profileUsername}`);
  }

  if (tweetId) {
    revalidatePath(`/tweet/${tweetId}`);
  }

  if (replyToId) {
    revalidatePath(`/tweet/${replyToId}`);
  }
}

function updateTweetRelation(
  tweets: TweetRecord[],
  tweetId: string,
  currentUserId: string,
  relationKey: TweetRelationKey,
) {
  return tweets.map((tweet) => {
    if (tweet.id !== tweetId) {
      return tweet;
    }

    return {
      ...tweet,
      [relationKey]: toggleUserRelation(currentUserId, tweet[relationKey]),
    };
  });
}

function normalizeSettings(formData: FormData) {
  const language = String(formData.get('language') ?? '') as UserLanguage;

  if (!ALLOWED_LANGUAGES.has(language)) {
    return null;
  }

  return { language };
}

async function withCurrentUser(
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

async function updateTweets(
  updater: (tweets: TweetRecord[]) => TweetRecord[],
) {
  await updateDemoDatabase((draft) => ({
    ...draft,
    tweets: updater(draft.tweets),
  }));
}

async function updateUsers(updater: DemoDatabase['users'] extends infer T
  ? T extends Array<infer U>
    ? (users: U[]) => U[]
    : never
  : never) {
  await updateDemoDatabase((draft) => ({
    ...draft,
    users: updater(draft.users),
  }));
}

export async function createTweetAction(
  _previousState: TweetActionState,
  formData: FormData,
): Promise<TweetActionState> {
  const context = await getDatabaseContext();
  const language = resolveLanguage(context?.currentUser?.settings);
  const { actions } = getDictionary(language);

  if (!context) {
    return {
      status: 'error',
      message: actions.signInBeforePosting,
    };
  }

  const parsed = createTweetSchema(language).safeParse({
    content: formData.get('content'),
    mediaUrl: formData.get('mediaUrl'),
    attachmentLabel: formData.get('attachmentLabel'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: actions.reviewTweet,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const replyToId = String(formData.get('replyToId') ?? '').trim() || null;

  if (replyToId && !findTweetById(context.database, replyToId)) {
    return {
      status: 'error',
      message: actions.replyMissing,
    };
  }

  await updateTweets((tweets) => [
    buildTweet(
      context.currentUser.id,
      parsed.data.content,
      parsed.data.mediaUrl,
      parsed.data.attachmentLabel,
      replyToId,
    ),
    ...tweets,
  ]);

  revalidateTweetSurfaces({
    profileUsername: context.currentUser.username,
    replyToId,
  });

  return {
    status: 'success',
    message: actions.tweetPublished,
  };
}

async function toggleTweetRelation(
  formData: FormData,
  relationKey: TweetRelationKey,
) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const tweetId = String(formData.get('tweetId') ?? '');
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet) {
      return;
    }

    await updateTweets((tweets) =>
      updateTweetRelation(tweets, tweetId, currentUserId, relationKey),
    );

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
      tweetId: targetTweet.id,
      replyToId: targetTweet.replyToId,
    });
  });
}

export async function toggleLikeAction(formData: FormData) {
  await toggleTweetRelation(formData, 'likedBy');
}

export async function toggleBookmarkAction(formData: FormData) {
  await toggleTweetRelation(formData, 'bookmarkedBy');
}

export async function toggleRepostAction(formData: FormData) {
  await toggleTweetRelation(formData, 'repostedBy');
}

export async function deleteTweetAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId, database }) => {
    const tweetId = String(formData.get('tweetId') ?? '');
    const targetTweet = findTweetById(database, tweetId);

    if (!targetTweet || targetTweet.authorId !== currentUserId) {
      return;
    }

    await updateTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId));

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
      tweetId: targetTweet.id,
      replyToId: targetTweet.replyToId,
    });
  });
}

export async function loginAction(formData: FormData) {
  const userId = String(formData.get('userId') ?? '');
  const database = await readDemoDatabase();
  const user = findUserById(database, userId);

  if (!user) {
    redirect('/');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, SESSION_COOKIE_OPTIONS);

  redirect('/profile-fake');
}

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

    await updateUsers((users) =>
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
    );

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
    });
    revalidatePath(`/u/${targetUser.username}`);
  });
}

export async function updateSettingsAction(formData: FormData) {
  await withCurrentUser(async ({ currentUser, currentUserId }) => {
    const settings = normalizeSettings(formData);

    if (!settings) {
      return;
    }

    await updateUsers((users) =>
      users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              settings,
            }
          : user,
      ),
    );

    revalidateTweetSurfaces({
      profileUsername: currentUser.username,
    });
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
