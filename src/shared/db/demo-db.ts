import { seedDatabase } from '@/shared/data/seed-data';
import { prisma } from './prisma';
import type {
  DatabaseTweetMedia,
  DatabaseUserSettings,
  DemoDatabase,
} from './types';

let updateQueue = Promise.resolve();
let schemaQueue: Promise<void> | null = null;

function parseJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function toStringArray(value: unknown) {
  const parsed = typeof value === 'string' ? parseJson(value) : value;

  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === 'string')
    : [];
}

function toSettings(value: unknown): DatabaseUserSettings {
  const parsed = typeof value === 'string' ? parseJson(value) : value;

  if (
    parsed &&
    typeof parsed === 'object' &&
    'language' in parsed &&
    (parsed.language === 'en' || parsed.language === 'ru')
  ) {
    return {
      language: parsed.language,
    };
  }

  return { language: 'en' };
}

function toMedia(value: unknown): DatabaseTweetMedia | null {
  const parsed = typeof value === 'string' ? parseJson(value) : value;

  if (!parsed || typeof parsed !== 'object' || !('url' in parsed) || !('type' in parsed)) {
    return null;
  }

  const media = parsed as Partial<DatabaseTweetMedia>;

  if (
    typeof media.url !== 'string' ||
    (media.type !== 'image' && media.type !== 'link')
  ) {
    return null;
  }

  return {
    url: media.url,
    type: media.type,
    title: media.title,
    description: media.description,
    attachmentLabel: media.attachmentLabel,
  };
}

export async function ensureDemoDatabaseSchema() {
  schemaQueue ??= prisma.$transaction([
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "username" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "bio" TEXT NOT NULL,
        "avatar" TEXT NOT NULL,
        "followers" INTEGER NOT NULL,
        "following" INTEGER NOT NULL,
        "followingIds" TEXT NOT NULL,
        "topics" TEXT NOT NULL,
        "settings" TEXT NOT NULL
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key"
      ON "User"("username")
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Tweet" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "authorId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL,
        "hashtags" TEXT NOT NULL,
        "likedBy" TEXT NOT NULL,
        "bookmarkedBy" TEXT NOT NULL,
        "repostedBy" TEXT NOT NULL,
        "views" INTEGER NOT NULL,
        "replyToId" TEXT,
        "media" TEXT,
        CONSTRAINT "Tweet_authorId_fkey"
          FOREIGN KEY ("authorId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Tweet_authorId_idx"
      ON "Tweet"("authorId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Tweet_replyToId_idx"
      ON "Tweet"("replyToId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Tweet_createdAt_idx"
      ON "Tweet"("createdAt")
    `),
  ]).then(() => undefined);

  await schemaQueue;
}

async function ensureDatabase() {
  await ensureDemoDatabaseSchema();

  const userCount = await prisma.user.count();
  const tweetCount = await prisma.tweet.count();

  if (userCount === 0 && tweetCount === 0) {
    await writeDemoDatabase(seedDatabase);
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDatabase();

  const [users, tweets] = await Promise.all([
    prisma.user.findMany({
      orderBy: { username: 'asc' },
    }),
    prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following,
      followingIds: toStringArray(user.followingIds),
      topics: toStringArray(user.topics),
      settings: toSettings(user.settings),
    })),
    tweets: tweets.map((tweet) => ({
      id: tweet.id,
      authorId: tweet.authorId,
      content: tweet.content,
      createdAt: tweet.createdAt.toISOString(),
      hashtags: toStringArray(tweet.hashtags),
      likedBy: toStringArray(tweet.likedBy),
      bookmarkedBy: toStringArray(tweet.bookmarkedBy),
      repostedBy: toStringArray(tweet.repostedBy),
      views: tweet.views,
      replyToId: tweet.replyToId,
      media: toMedia(tweet.media),
    })),
  };
}

export async function writeDemoDatabase(database: DemoDatabase) {
  await ensureDemoDatabaseSchema();

  await prisma.$transaction(async (transaction) => {
    await transaction.tweet.deleteMany();
    await transaction.user.deleteMany();

    if (database.users.length > 0) {
      await transaction.user.createMany({
        data: database.users.map((user) => ({
          id: user.id,
          username: user.username,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          followers: user.followers,
          following: user.following,
          followingIds: JSON.stringify(user.followingIds),
          topics: JSON.stringify(user.topics),
          settings: JSON.stringify(user.settings),
        })),
      });
    }

    if (database.tweets.length > 0) {
      await transaction.tweet.createMany({
        data: database.tweets.map((tweet) => ({
          id: tweet.id,
          authorId: tweet.authorId,
          content: tweet.content,
          createdAt: new Date(tweet.createdAt),
          hashtags: JSON.stringify(tweet.hashtags),
          likedBy: JSON.stringify(tweet.likedBy),
          bookmarkedBy: JSON.stringify(tweet.bookmarkedBy),
          repostedBy: JSON.stringify(tweet.repostedBy),
          views: tweet.views,
          replyToId: tweet.replyToId,
          media: tweet.media ? JSON.stringify(tweet.media) : null,
        })),
      });
    }
  });
}

export async function updateDemoDatabase(
  updater: (database: DemoDatabase) => DemoDatabase | Promise<DemoDatabase>,
) {
  const update = updateQueue.then(async () => {
    const database = await readDemoDatabase();
    const nextDatabase = await updater(database);
    await writeDemoDatabase(nextDatabase);
    return nextDatabase;
  });

  updateQueue = update.then(
    () => undefined,
    () => undefined,
  );

  return update;
}
