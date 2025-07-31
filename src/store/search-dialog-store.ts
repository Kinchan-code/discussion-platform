import { updateUrlParam } from '@/lib/utils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * SearchDialogStore
 * @description This store manages the state of the search dialog.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the dialog state across sessions.
 *
 * @returns {SearchDialogStore} The store for managing the search dialog state.
 * @example
 * const { isOpen, searchQuery, setIsOpen, setSearchQuery } = useSearchDialogStore();
 */

interface SearchDialogStore {
  isOpen: boolean;
  searchQuery: string;
  setIsOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleOpen: () => void;
  clearSearchQuery: () => void;
}

const PARAM_NAME = 'q';

export const useSearchDialogStore = create<SearchDialogStore>()(
  persist(
    (set) => {
      const searchParams: URLSearchParams = new URLSearchParams(
        window.location.search
      );

      return {
        isOpen: false,
        searchQuery: searchParams.get(PARAM_NAME) || '',
        setIsOpen: (isOpen: boolean) => {
          set({ isOpen });

          // Remove URL params when dialog is closed
          if (!isOpen) {
            updateUrlParam(PARAM_NAME, null);
          }
        },
        setSearchQuery: (searchQuery: string) => set({ searchQuery }),
        toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
        clearSearchQuery: () => set({ searchQuery: '' }),
      };
    },
    {
      name: 'search-dialog-store',
    }
  )
);
