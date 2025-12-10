import type { Protocols } from "@/types/protocols";
import type { Threads } from "@/types/threads";

interface ProtocolResult {
  results: Protocols[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface ThreadResult {
  results: Threads[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Search {
  protocols: ProtocolResult;
  threads: ThreadResult;
}
