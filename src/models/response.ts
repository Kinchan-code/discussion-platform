import type { Pagination } from "@/models/pagination";

export interface Response<T> {
  status_code: number;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface ResponseError {
  status_code: number;
  error: string;
  message: string;
}
