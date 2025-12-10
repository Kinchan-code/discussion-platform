import type { User } from "@/types/login";
import type { VotableType, VoteType } from "@/enums/vote-type-enums";

export interface Vote {
  id: string;
  votable_id: number;
  votable_type: VotableType;
  type: VoteType;
  user: User;
  updated_at: string;
  created_at: string;
}
