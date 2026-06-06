import type {
  DatabaseTweetMedia,
  DatabaseTweetRecord,
} from '@/shared/db';

export interface TweetAuthor {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  topics: string[];
}

export type TweetMedia = DatabaseTweetMedia;
export type TweetRecord = DatabaseTweetRecord;

export type TweetRelationKey = 'likedBy' | 'bookmarkedBy' | 'repostedBy';

export interface TweetView {
  id: string;
  content: string;
  createdAt: string;
  hashtags: string[];
  likes: number;
  bookmarks: number;
  reposts: number;
  views: number;
  repliesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  isOwn: boolean;
  replyToId: string | null;
  media?: TweetMedia | null;
  replyTo?: Pick<TweetAuthor, 'username' | 'name'> | null;
  author: TweetAuthor;
}

export interface TweetThreadNode {
  tweet: TweetView;
  replies: TweetThreadNode[];
  depth: number;
}
