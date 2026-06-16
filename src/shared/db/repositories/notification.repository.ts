import { prisma } from '../prisma';

export async function countNotificationRecords(currentUserId: string) {
  const [follows, replies, likes, bookmarks, reposts] = await Promise.all([
    prisma.follow.count({
      where: {
        followerId: { not: currentUserId },
        followingId: currentUserId,
      },
    }),
    prisma.tweet.count({
      where: {
        authorId: { not: currentUserId },
        replyTo: { authorId: currentUserId },
      },
    }),
    prisma.like.count({
      where: {
        userId: { not: currentUserId },
        tweet: { authorId: currentUserId },
      },
    }),
    prisma.bookmark.count({
      where: {
        userId: { not: currentUserId },
        tweet: { authorId: currentUserId },
      },
    }),
    prisma.repost.count({
      where: {
        userId: { not: currentUserId },
        tweet: { authorId: currentUserId },
      },
    }),
  ]);

  return Math.min(follows + replies + likes + bookmarks + reposts, 24);
}
