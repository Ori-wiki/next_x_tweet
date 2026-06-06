import type {
  DatabaseUserLanguage,
  DatabaseUserRecord,
  DatabaseUserSettings,
} from '@/shared/db';

export type UserLanguage = DatabaseUserLanguage;
export type UserSettings = DatabaseUserSettings;
export type UserRecord = DatabaseUserRecord;

export type SessionUser = UserRecord;
