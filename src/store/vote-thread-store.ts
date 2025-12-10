import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * VoteThreadStore
 * @description This store manages the voting state for threads.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the voting state across sessions.
 *
 * @returns {VoteThreadStore} The store for managing thread voting state.
 * @example
 * const { vote, setVote, getVote } = useVoteThreadStore();
 */

export interface VoteThreadStore {
  vote: Record<number, "upvote" | "downvote" | null>; // threadId -> vote status
  setVote: (threadId: number, vote: "upvote" | "downvote" | null) => void;
  getVote: (threadId: number) => "upvote" | "downvote" | null;
  hasUpvoted: (threadId: number) => boolean;
  hasDownvoted: (threadId: number) => boolean;
}

export const useVoteThreadStore = create<VoteThreadStore>()(
  persist(
    (set, get) => ({
      vote: {},
      setVote: (threadId, vote) =>
        set((state) => ({
          vote: { ...state.vote, [threadId]: vote },
        })),
      getVote: (threadId) => get().vote[threadId] || null,
      hasUpvoted: (threadId) => get().vote[threadId] === "upvote",
      hasDownvoted: (threadId) => get().vote[threadId] === "downvote",
    }),
    {
      name: "vote-thread-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
