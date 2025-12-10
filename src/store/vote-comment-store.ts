import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * VoteCommentStore
 * @description This store manages the voting state for comments.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the voting state across sessions.
 *
 * @returns {VoteCommentStore} The store for managing comment voting state.
 * @example
 * const { votes, setVote, getVote } = useVoteCommentStore();
 */

export interface VoteCommentStore {
  votes: Record<number, "upvote" | "downvote" | null>; // commentId -> vote status
  setVote: (commentId: number, vote: "upvote" | "downvote" | null) => void;
  getVote: (commentId: number) => "upvote" | "downvote" | null;
  hasUpvoted: (commentId: number) => boolean;
  hasDownvoted: (commentId: number) => boolean;
}

export const useVoteCommentStore = create<VoteCommentStore>()(
  persist(
    (set, get) => ({
      votes: {},
      setVote: (commentId, vote) =>
        set((state) => ({
          votes: { ...state.votes, [commentId]: vote },
        })),
      getVote: (commentId) => get().votes[commentId] || null,
      hasUpvoted: (commentId) => get().votes[commentId] === "upvote",
      hasDownvoted: (commentId) => get().votes[commentId] === "downvote",
    }),
    {
      name: "vote-comment-storage", // Name of the storage key
      storage: createJSONStorage(() => localforage),
    }
  )
);
