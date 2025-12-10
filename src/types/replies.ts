interface ReplyingTo {
  id: string;
  author: string;
  body: string;
}

export interface Reply {
  id: string;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  user_vote: string | null;
  nested_replies_count: number;
  replying_to: ReplyingTo | null;
  created_at: string;
  updated_at: string;
}
