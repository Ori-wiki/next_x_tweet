export interface UserRecord {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
}

export type SessionUser = UserRecord;
