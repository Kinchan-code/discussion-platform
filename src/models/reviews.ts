export interface Reviews {
  id: number;
  protocol_id: number;
  rating: number;
  feedback: string;
  author: string;
  created_at: string;
  updated_at: string;
  helpful_count: number;
  not_helpful_count: number;
}

export interface VoteReview {
  helpful_count: number;
  not_helpful_count: number;
  user_vote: null | 'helpful' | 'not_helpful';
}
