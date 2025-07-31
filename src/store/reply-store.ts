import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * ReplyStore
 * @description This store manages the state of replies in the discussion platform, including which comment or reply has its reply form open, which replies are shown, and which comments or replies are highlighted.
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
  // Track which comment has its replies shown
  activeShowRepliesCommentId: string | null;
  // Track which reply has its replies shown
  activeShowRepliesReplyId: string | null;
  // Highlighted comment ID for scrolling
  highlightCommentId: string | null;
  // Highlighted reply ID for scrolling
  highlightReplyId: string | null;
  // Track if is editing a comment
  editingComment: string | null;
  // Track if is editing a reply
  editingReply: string | null;

  // Actions
  setReplyComment: (commentId: string | null) => void;
  setReplyReply: (replyId: string | null) => void;
  setShowRepliesComment: (commentId: string | null) => void;
  setShowRepliesReply: (replyId: string | null) => void;
  setHighlightComment: (commentId: string | null) => void;
  setHighlightReply: (replyId: string | null) => void;
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
      activeShowRepliesCommentId: null,
      activeShowRepliesReplyId: null,
      highlightCommentId: null,
      highlightReplyId: null,
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
        const currentId = get().activeShowRepliesCommentId;
        set({
          activeShowRepliesCommentId:
            currentId === commentId ? null : commentId,
        });
      },

      setShowRepliesReply: (replyId) => {
        const currentId = get().activeShowRepliesReplyId;
        set({
          activeShowRepliesReplyId: currentId === replyId ? null : replyId,
        });
      },

      setHighlightComment: (commentId) => {
        set({ highlightCommentId: commentId });
      },

      setHighlightReply: (replyId) => {
        set({ highlightReplyId: replyId });
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
        get().activeShowRepliesCommentId === commentId,
      isShowRepliesReplyActive: (replyId) =>
        get().activeShowRepliesReplyId === replyId,
    }),
    {
      name: 'reply-store',
    }
  )
);

export default useReplyStore;
