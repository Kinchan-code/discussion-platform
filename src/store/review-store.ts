import type { Reviews } from '@/models/reviews';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * ReviewStore
 * @description This store manages the state of reviews, including opening and editing review modals,
 * highlighting reviews, and selecting a review for editing.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the review state across sessions.
 *
 * @returns {ReviewStore} The store for managing the review state.
 * @example
 * const { isOpen, setOpen, selectedReview, setSelectedReview } = useReviewStore();
 */

interface ReviewStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isOpenEdit: boolean;
  setOpenEdit: (open: boolean) => void;
  selectedReview: Reviews | null;
  highlightReview: string | null;
  setHighlightReview: (reviewId: string | null) => void;
  setSelectedReview: (review: Reviews | null) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isOpenEdit: false,
      highlightReview: null,
      selectedReviewId: null,
      selectedReview: null,

      setOpen: (open) => set({ isOpen: open }),
      setOpenEdit: (open) => set({ isOpenEdit: open }),
      setHighlightReview: (reviewId) => set({ highlightReview: reviewId }),
      setSelectedReview: (review: Reviews | null) =>
        set({ selectedReview: review }),
    }),
    {
      name: 'review-store',
    }
  )
);
