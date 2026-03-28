export type UserLanguage = 'en' | 'ru';

export interface UserSettings {
  language: UserLanguage;
}

export interface UserRecord {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  followingIds: string[];
  topics: string[];
  settings: UserSettings;
}

export type SessionUser = UserRecord;
