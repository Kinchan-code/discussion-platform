import type { Protocols } from "@/models/protocols";
import type { Threads } from "@/models/threads";
import type { Pagination } from "@/models/pagination";

interface Results {
  protocols: Protocols[];
  protocols_pagination: Pagination;
  threads: Threads[];
  threads_pagination: Pagination;
}

export interface Search {
  query: string;
  results: Results;
  total: number;
}
