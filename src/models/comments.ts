import type { Replies } from '@/models/replies';
import type { Threads } from '@/models/threads';
import type { Vote } from '@/models/vote';

export interface Comments {
  id: number;
  thread_id: number;
  parent_id: number | null;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  replies_count: number;
  replies: Replies[];
  created_at: string;
  updated_at: string;
  thread: Threads;
  parent: string;
  is_highlighted?: boolean; // Optional property to indicate if the comment is highlighted
}

export interface VoteComments {
  comment: Comments;
  vote: Vote;
}
