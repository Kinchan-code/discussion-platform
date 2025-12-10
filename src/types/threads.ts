import type { Protocols } from "@/types/protocols";

export interface Threads {
  id: string;
  title: string;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  user_vote: string | null;
  comments_count: number;
  protocol: Protocols;
  created_at: string;
  updated_at: string;
}
