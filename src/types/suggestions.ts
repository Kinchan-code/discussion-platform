import type { Protocols } from "@/types/protocols";
import type { Threads } from "@/types/threads";
import type { Tags } from "@/types/tags";

export interface Suggestions {
  protocols: Protocols[];
  threads: Threads[];
  tags: Tags[];
}
