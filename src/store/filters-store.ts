import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * FiltersStore
 * @description This store manages the state of the filters in the application.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the filter state across sessions.
 *
 * @returns {FiltersStore} The store for managing the filter state.
 * @example
 * const { isOpenFilter, setIsOpenFilter, toggleFilter } = useFiltersStore();
 */

interface FiltersStore {
  isOpenFilter: boolean;
  setIsOpenFilter: (isOpen: boolean) => void;
  toggleFilter: () => void;
}

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      isOpenFilter: false,
      setIsOpenFilter: (isOpen) => set({ isOpenFilter: isOpen }),
      toggleFilter: () =>
        set((state) => ({ isOpenFilter: !state.isOpenFilter })),
    }),
    {
      name: "filters-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
