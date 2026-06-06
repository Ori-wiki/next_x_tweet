export type DatabaseUserLanguage = 'en' | 'ru';

export interface DatabaseUserSettings {
  language: DatabaseUserLanguage;
}

export interface DatabaseUserRecord {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  followingIds: string[];
  topics: string[];
  settings: DatabaseUserSettings;
}

export interface DatabaseTweetMedia {
  url: string;
  type: 'image' | 'link';
  title?: string;
  description?: string;
  attachmentLabel?: string;
}

export interface DatabaseTweetRecord {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  hashtags: string[];
  likedBy: string[];
  bookmarkedBy: string[];
  repostedBy: string[];
  views: number;
  replyToId: string | null;
  media?: DatabaseTweetMedia | null;
}

export interface DemoDatabase {
  users: DatabaseUserRecord[];
  tweets: DatabaseTweetRecord[];
}
