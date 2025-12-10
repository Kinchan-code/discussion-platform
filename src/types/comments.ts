import type { Threads } from "@/types/threads";

export interface Comments {
  id: string;
  thread_id: number;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  user_vote: string | null;
  replies_count: number;
  thread: Threads;
  created_at: string;
  updated_at: string;
}
