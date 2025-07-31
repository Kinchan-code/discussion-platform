export interface Vote {
  id: number;
  type: 'upvote' | 'downvote';
  user_id: number;
  votable_id: number;
  votable_type: string;
  updated_at: string;
  created_at: string;
}
