import { seedDatabase } from '../src/shared/data/seed-data';
import { writeDemoDatabase } from '../src/shared/db/demo-db';
import { prisma } from '../src/shared/db/prisma';

async function main() {
  await writeDemoDatabase(seedDatabase);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
