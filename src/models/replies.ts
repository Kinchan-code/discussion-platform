export interface Reply {
  id: number;
  body: string;
  author: string;
  replying_to: string | null;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  created_at: string;
  updated_at: string;
}

export interface Replies extends Reply {
  nested_replies: Reply[];
  nested_replies_count: number;
}
