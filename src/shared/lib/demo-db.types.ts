import type { TweetRecord } from '@/src/entities/tweet/model/types';
import type { UserRecord } from '@/src/entities/user/model/types';

export interface DemoDatabase {
  users: UserRecord[];
  tweets: TweetRecord[];
}
