export type UserTheme = 'midnight' | 'dawn';

export type UserDensity = 'comfortable' | 'compact';

export type UserLanguage = 'en' | 'ru';

export interface UserSettings {
  theme: UserTheme;
  density: UserDensity;
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
