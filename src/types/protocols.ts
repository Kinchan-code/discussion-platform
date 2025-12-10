import type { Tags } from "@/types/tags";

export interface Protocols {
  id: string;
  title: string;
  content: string;
  tags: Tags[];
  author: string;
  reviews_count: number;
  threads_count: number;
  reviews_avg_rating: number;
  created_at: string;
  updated_at: string;
}
