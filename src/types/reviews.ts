export interface Reviews {
  id: string;
  protocol_id: number;
  rating: number;
  feedback: string;
  author: string;
  helpful_count: number;
  not_helpful_count: number;
  user_vote: string | null;
  created_at: string;
  updated_at: string;
}
