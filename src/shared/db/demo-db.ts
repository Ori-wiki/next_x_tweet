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
        "followers" INTEGER NOT NULL DEFAULT 0,
        "following" INTEGER NOT NULL DEFAULT 0,
        "followingIds" TEXT NOT NULL DEFAULT '[]',
        "topics" TEXT NOT NULL DEFAULT '[]',
        "settings" TEXT NOT NULL DEFAULT '{"language":"en"}'
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
        "likedBy" TEXT NOT NULL DEFAULT '[]',
        "bookmarkedBy" TEXT NOT NULL DEFAULT '[]',
        "repostedBy" TEXT NOT NULL DEFAULT '[]',
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
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserSettings" (
        "userId" TEXT NOT NULL PRIMARY KEY,
        "language" TEXT NOT NULL DEFAULT 'en',
        CONSTRAINT "UserSettings_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TweetMedia" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "tweetId" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT,
        "description" TEXT,
        "attachmentLabel" TEXT,
        CONSTRAINT "TweetMedia_tweetId_fkey"
          FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "TweetMedia_tweetId_key"
      ON "TweetMedia"("tweetId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Like" (
        "userId" TEXT NOT NULL,
        "tweetId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("userId", "tweetId"),
        CONSTRAINT "Like_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Like_tweetId_fkey"
          FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Like_tweetId_idx" ON "Like"("tweetId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Like_userId_idx" ON "Like"("userId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Bookmark" (
        "userId" TEXT NOT NULL,
        "tweetId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("userId", "tweetId"),
        CONSTRAINT "Bookmark_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Bookmark_tweetId_fkey"
          FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Bookmark_tweetId_idx" ON "Bookmark"("tweetId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Bookmark_userId_idx" ON "Bookmark"("userId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Repost" (
        "userId" TEXT NOT NULL,
        "tweetId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("userId", "tweetId"),
        CONSTRAINT "Repost_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Repost_tweetId_fkey"
          FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Repost_tweetId_idx" ON "Repost"("tweetId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Repost_userId_idx" ON "Repost"("userId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Follow" (
        "followerId" TEXT NOT NULL,
        "followingId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("followerId", "followingId"),
        CONSTRAINT "Follow_followerId_fkey"
          FOREIGN KEY ("followerId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Follow_followingId_fkey"
          FOREIGN KEY ("followingId") REFERENCES "User" ("id")
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Follow_followerId_idx" ON "Follow"("followerId")
    `),
    prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Follow_followingId_idx" ON "Follow"("followingId")
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
      include: {
        followers: true,
        following: true,
        settings: true,
      },
      orderBy: { username: 'asc' },
    }),
    prisma.tweet.findMany({
      include: {
        bookmarks: true,
        likes: true,
        media: true,
        reposts: true,
      },
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
      followers: user.followers.length,
      following: user.following.length,
      followingIds: user.following.map((follow) => follow.followingId),
      topics: toStringArray(user.topics),
      settings: toSettings(user.settings),
    })),
    tweets: tweets.map((tweet) => ({
      id: tweet.id,
      authorId: tweet.authorId,
      content: tweet.content,
      createdAt: tweet.createdAt.toISOString(),
      hashtags: toStringArray(tweet.hashtags),
      likedBy: tweet.likes.map((like) => like.userId),
      bookmarkedBy: tweet.bookmarks.map((bookmark) => bookmark.userId),
      repostedBy: tweet.reposts.map((repost) => repost.userId),
      views: tweet.views,
      replyToId: tweet.replyToId,
      media: toMedia(tweet.media),
    })),
  };
}

export async function writeDemoDatabase(database: DemoDatabase) {
  await ensureDemoDatabaseSchema();

  await prisma.$transaction(async (transaction) => {
    await transaction.like.deleteMany();
    await transaction.bookmark.deleteMany();
    await transaction.repost.deleteMany();
    await transaction.follow.deleteMany();
    await transaction.tweetMedia.deleteMany();
    await transaction.userSettings.deleteMany();
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
          followersCount: user.followers,
          followingCount: user.following,
          legacyFollowingIds: JSON.stringify(user.followingIds),
          topics: JSON.stringify(user.topics),
          legacySettings: JSON.stringify(user.settings),
        })),
      });

      await transaction.userSettings.createMany({
        data: database.users.map((user) => ({
          userId: user.id,
          language: user.settings.language,
        })),
      });

      const follows = database.users.flatMap((user) =>
        user.followingIds.map((followingId) => ({
          followerId: user.id,
          followingId,
        })),
      );

      if (follows.length > 0) {
        await transaction.follow.createMany({
          data: follows,
        });
      }
    }

    if (database.tweets.length > 0) {
      await transaction.tweet.createMany({
        data: database.tweets.map((tweet) => ({
          id: tweet.id,
          authorId: tweet.authorId,
          content: tweet.content,
          createdAt: new Date(tweet.createdAt),
          hashtags: JSON.stringify(tweet.hashtags),
          legacyLikedBy: JSON.stringify(tweet.likedBy),
          legacyBookmarkedBy: JSON.stringify(tweet.bookmarkedBy),
          legacyRepostedBy: JSON.stringify(tweet.repostedBy),
          views: tweet.views,
          replyToId: tweet.replyToId,
          legacyMedia: tweet.media ? JSON.stringify(tweet.media) : null,
        })),
      });

      const media = database.tweets.flatMap((tweet) =>
        tweet.media
          ? [{
              tweetId: tweet.id,
              url: tweet.media.url,
              type: tweet.media.type,
              title: tweet.media.title,
              description: tweet.media.description,
              attachmentLabel: tweet.media.attachmentLabel,
            }]
          : [],
      );

      if (media.length > 0) {
        await transaction.tweetMedia.createMany({ data: media });
      }

      const likes = database.tweets.flatMap((tweet) =>
        tweet.likedBy.map((userId) => ({ tweetId: tweet.id, userId })),
      );
      const bookmarks = database.tweets.flatMap((tweet) =>
        tweet.bookmarkedBy.map((userId) => ({ tweetId: tweet.id, userId })),
      );
      const reposts = database.tweets.flatMap((tweet) =>
        tweet.repostedBy.map((userId) => ({ tweetId: tweet.id, userId })),
      );

      if (likes.length > 0) {
        await transaction.like.createMany({ data: likes });
      }

      if (bookmarks.length > 0) {
        await transaction.bookmark.createMany({
          data: bookmarks,
        });
      }

      if (reposts.length > 0) {
        await transaction.repost.createMany({
          data: reposts,
        });
      }
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
