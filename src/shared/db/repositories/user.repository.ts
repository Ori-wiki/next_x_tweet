import { prisma } from '../prisma';

export async function findUserRecordById(userId: string) {
  return prisma.user.findUnique({
    include: {
      followers: true,
      following: true,
      settings: true,
    },
    where: { id: userId },
  });
}

export async function listUserRecords() {
  return prisma.user.findMany({
    include: {
      followers: true,
      following: true,
      settings: true,
    },
    orderBy: { username: 'asc' },
  });
}

export async function listDemoRoleUsers() {
  return prisma.user.findMany({
    orderBy: { username: 'asc' },
    select: {
      avatar: true,
      bio: true,
      id: true,
      name: true,
      username: true,
    },
  });
}
