import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * ReplyStore
 * @description This store manages the state of replies in the discussion platform, including which comment or reply has its reply form open, which replies are shown.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the reply state across sessions.
 *
 * @returns {ReplyStore} The store for managing the reply state.
 * @example
 * const { activeReplyCommentId, setReplyComment } = useReplyStore();
 */

interface ReplyStore {
  // Track which specific comment has its reply form open
  activeReplyCommentId: string | null;
  // Track which specific reply has its reply form open
  activeReplyReplyId: string | null;
  // Track which comments have their replies shown (array to allow multiple)
  activeShowRepliesCommentIds: string[];
  // Track which replies have their replies shown (array to allow multiple)
  activeShowRepliesReplyIds: string[];
  // Track if is editing a comment
  editingComment: string | null;
  // Track if is editing a reply
  editingReply: string | null;

  // Actions
  setReplyComment: (commentId: string | null) => void;
  setReplyReply: (replyId: string | null) => void;
  setShowRepliesComment: (commentId: string | null) => void;
  setShowRepliesReply: (replyId: string | null) => void;
  setEditingComment: (isEditing: string | null) => void;
  setEditingReply: (isEditing: string | null) => void;

  // Helper methods to check if a specific ID is active
  isReplyCommentActive: (commentId: string) => boolean;
  isReplyReplyActive: (replyId: string) => boolean;
  isShowRepliesCommentActive: (commentId: string) => boolean;
  isShowRepliesReplyActive: (replyId: string) => boolean;
}

const useReplyStore = create<ReplyStore>()(
  persist(
    (set, get) => ({
      activeReplyCommentId: null,
      activeReplyReplyId: null,
      activeShowRepliesCommentIds: [],
      activeShowRepliesReplyIds: [],
      editingComment: null,
      editingReply: null,

      setReplyComment: (commentId) => {
        // If clicking the same comment, close it. Otherwise, open the new one and close others
        const currentId = get().activeReplyCommentId;
        set({
          activeReplyCommentId: currentId === commentId ? null : commentId,
          activeReplyReplyId: null, // Close any reply forms when opening comment form
        });
      },

      setReplyReply: (replyId) => {
        // If clicking the same reply, close it. Otherwise, open the new one and close others
        const currentId = get().activeReplyReplyId;
        set({
          activeReplyReplyId: currentId === replyId ? null : replyId,
          activeReplyCommentId: null, // Close any comment forms when opening reply form
        });
      },

      setShowRepliesComment: (commentId) => {
        if (!commentId) {
          set({ activeShowRepliesCommentIds: [] });
          return;
        }
        const currentIds = get().activeShowRepliesCommentIds;
        const isActive = currentIds.includes(commentId);
        set({
          activeShowRepliesCommentIds: isActive
            ? currentIds.filter((id) => id !== commentId)
            : [...currentIds, commentId],
        });
      },

      setShowRepliesReply: (replyId) => {
        if (!replyId) {
          set({ activeShowRepliesReplyIds: [] });
          return;
        }
        const currentIds = get().activeShowRepliesReplyIds;
        const isActive = currentIds.includes(replyId);
        set({
          activeShowRepliesReplyIds: isActive
            ? currentIds.filter((id) => id !== replyId)
            : [...currentIds, replyId],
        });
      },

      setEditingComment: (isEditing) => {
        set({ editingComment: isEditing });
      },

      setEditingReply: (isEditing) => {
        set({ editingReply: isEditing });
      },

      // Helper methods
      isReplyCommentActive: (commentId) =>
        get().activeReplyCommentId === commentId,
      isReplyReplyActive: (replyId) => get().activeReplyReplyId === replyId,
      isShowRepliesCommentActive: (commentId) =>
        get().activeShowRepliesCommentIds.includes(commentId),
      isShowRepliesReplyActive: (replyId) =>
        get().activeShowRepliesReplyIds.includes(replyId),
    }),
    {
      name: "reply-store",
      storage: createJSONStorage(() => localforage),
    }
  )
);

export default useReplyStore;
