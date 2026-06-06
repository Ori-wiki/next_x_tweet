import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { seedDatabase } from '@/shared/data/seed-data';
import type { DemoDatabase } from './types';

const demoDbPath =
  process.env.DEMO_DB_PATH ?? path.join(process.cwd(), 'data', 'demo-db.json');

async function ensureDatabaseFile() {
  await mkdir(path.dirname(demoDbPath), { recursive: true });

  try {
    await readFile(demoDbPath, 'utf-8');
  } catch {
    await writeFile(demoDbPath, JSON.stringify(seedDatabase, null, 2), 'utf-8');
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDatabaseFile();
  const raw = await readFile(demoDbPath, 'utf-8');
  return JSON.parse(raw) as DemoDatabase;
}

export async function writeDemoDatabase(database: DemoDatabase) {
  await ensureDatabaseFile();
  await writeFile(demoDbPath, JSON.stringify(database, null, 2), 'utf-8');
}

export async function updateDemoDatabase(
  updater: (database: DemoDatabase) => DemoDatabase | Promise<DemoDatabase>,
) {
  const database = await readDemoDatabase();
  const nextDatabase = await updater(database);
  await writeDemoDatabase(nextDatabase);
  return nextDatabase;
}
