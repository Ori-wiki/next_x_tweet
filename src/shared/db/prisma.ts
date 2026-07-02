import { PrismaClient } from '@prisma/client';

// Vercel functions can only write to /tmp. The demo database is created and
// seeded at runtime, so a relative SQLite URL would try to write into the
// read-only deployment bundle and crash the server-rendered page.
if (
  process.env.VERCEL &&
  (!process.env.DATABASE_URL ||
    process.env.DATABASE_URL.startsWith('file:./') ||
    process.env.DATABASE_URL.startsWith('file:../'))
) {
  process.env.DATABASE_URL = 'file:/tmp/next-x-tweet.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
