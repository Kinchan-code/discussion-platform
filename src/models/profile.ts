import type { Threads } from '@/models/threads';

interface ProtocolDetail {
  total: number;
  total_reviews_received: number;
  total_threads_created: number;
}

interface ThreadDetail {
  total: number;
  total_comments_received: number;
  total_votes_received: number;
}

interface CommentDetail {
  direct_comments: number;
  replies: number;
  total_votes_received: number;
}

interface ReviewDetail {
  total: number;
  average_rating_given: number;
  highest_rating_given: number;
  lowest_rating_given: number;
}

interface DetailedStats {
  protocols: ProtocolDetail;
  threads: ThreadDetail;
  comments: CommentDetail;
  reviews: ReviewDetail;
}

export interface ProfileStatistics {
  total_protocols: number;
  total_threads: number;
  total_comments: number;
  total_replies: number;
  total_reviews: number;
  total_votes_received: number;
  detailed_stats: DetailedStats;
  member_since: string;
}

export interface Engagement {
  total_votes: number;
  vote_ratio: number;
  has_replies: boolean;
  activity_level: string; // e.g., 'low', 'medium', 'high'
}

export interface Context {
  is_nested_reply: boolean;
  replying_to_author: string;
  replying_to_excerpt: string;
  original_comment_id: number;
}

export interface Navigation {
  comment_url: string;
  thread_url: string;
  replies_url: string | null;
}

export interface UserComments {
  id: number;
  body: string;
  author: string;
  thread_id: number;
  parent_id: number | null;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  thread: Threads;
  engagement: Engagement;
  reply_context: Context;
  navigation: Navigation;
}
