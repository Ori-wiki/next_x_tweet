export interface TweetAuthor {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
}

export interface TweetRecord {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  hashtags: string[];
  likedBy: string[];
  bookmarkedBy: string[];
}

export interface TweetView {
  id: string;
  content: string;
  createdAt: string;
  hashtags: string[];
  likes: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: TweetAuthor;
}
