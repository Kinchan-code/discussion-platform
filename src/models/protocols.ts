import type { Reviews } from "@/models/reviews";
import type { Threads } from "@/models/threads";
import type { Tags } from "@/models/tags";

export interface Protocols {
  id: number;
  title: string;
  content: string;
  tags: Tags[];
  author: string;
  rating: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
  threads_count: number;
  reviews_avg_rating: number;
  threads: Threads[];
  reviews: Reviews[];
}
