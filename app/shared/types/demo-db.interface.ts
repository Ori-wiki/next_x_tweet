import type { TweetRecord } from './tweet.interface';
import type { UserRecord } from './user.interface';

export interface DemoDatabase {
  users: UserRecord[];
  tweets: TweetRecord[];
}
