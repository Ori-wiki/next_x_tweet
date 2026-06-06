import type { SessionUser } from '@/entities/user/@x/tweet';
import { getTimeline } from './timeline';

export async function getDashboardData(currentUser: SessionUser) {
  const timeline = await getTimeline(currentUser);

  return {
    latestTweets: timeline.slice(0, 3),
    likedTweets: timeline.filter((tweet) => tweet.isLiked),
    bookmarkedTweets: timeline.filter((tweet) => tweet.isBookmarked),
    repostedTweets: timeline.filter((tweet) => tweet.isReposted),
    mediaTweets: timeline.filter((tweet) => tweet.media),
  };
}
