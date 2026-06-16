import { prisma } from '../prisma';
import { tweetRecordInclude } from './tweet.repository';

export async function listHomeTimelineRecords() {
  return prisma.tweet.findMany({
    include: tweetRecordInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function listBookmarkTimelineRecords(userId: string) {
  return prisma.tweet.findMany({
    include: tweetRecordInclude,
    orderBy: { createdAt: 'desc' },
    where: {
      bookmarks: {
        some: { userId },
      },
    },
  });
}
