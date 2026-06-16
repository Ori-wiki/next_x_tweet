import { ensureDemoDatabaseSchema } from '../src/shared/db/demo-db';
import { prisma } from '../src/shared/db/prisma';

async function main() {
  await ensureDemoDatabaseSchema();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
