import { prisma } from '../prisma';

export const tweetRecordInclude = {
  author: true,
  bookmarks: true,
  likes: true,
  media: true,
  reposts: true,
} as const;

export async function findTweetRecordById(tweetId: string) {
  return prisma.tweet.findUnique({
    include: tweetRecordInclude,
    where: { id: tweetId },
  });
}

export async function listTweetRecords() {
  return prisma.tweet.findMany({
    include: tweetRecordInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function listTweetRecordsByAuthor(authorId: string) {
  return prisma.tweet.findMany({
    include: tweetRecordInclude,
    orderBy: { createdAt: 'desc' },
    where: { authorId },
  });
}
