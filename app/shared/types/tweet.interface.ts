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

export interface TweetMedia {
  url: string;
  type: 'image' | 'link';
  title?: string;
  description?: string;
  attachmentLabel?: string;
}

export interface TweetRecord {
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
  media?: TweetMedia | null;
}

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
