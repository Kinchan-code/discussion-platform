import type { Protocols } from '@/models/protocols';
import type { Vote } from '@/models/vote';

export interface Threads {
  id: number;
  protocol_id: number;
  title: string;
  body: string;
  author: string;
  created_at: string;
  updated_at: string;
  comments_count: number;
  votes_count: number;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  protocol: Protocols;
}

export interface VoteThreads {
  thread: Threads;
  vote: Vote;
}
