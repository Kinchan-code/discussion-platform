import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * VoteReviewStore
 * @description This store manages the voting state for reviews.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the voting state across sessions.
 *
 * @returns {VoteReviewStore} The store for managing review voting state.
 * @example
 * const { votes, setVote, getVote } = useVoteReviewStore();
 */

export interface VoteReviewStore {
  votes: Record<number, "helpful" | "not_helpful" | null>; // reviewId -> vote status
  setVote: (reviewId: number, vote: "helpful" | "not_helpful" | null) => void;
  getVote: (reviewId: number) => "helpful" | "not_helpful" | null;
  hasUpvoted: (reviewId: number) => boolean;
}

export const useVoteReviewStore = create<VoteReviewStore>()(
  persist(
    (set, get) => ({
      votes: {},
      setVote: (reviewId, vote) =>
        set((state) => ({
          votes: { ...state.votes, [reviewId]: vote },
        })),
      getVote: (reviewId) => get().votes[reviewId] || null,
      hasUpvoted: (reviewId) => get().votes[reviewId] === "helpful",
    }),
    {
      name: "vote-review-storage", // Name of the storage key
      storage: createJSONStorage(() => localforage),
    }
  )
);
