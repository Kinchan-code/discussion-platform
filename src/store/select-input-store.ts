import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * SelectInputStore
 * @description This store manages the state of select inputs for sorting and filtering.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the select input state across sessions.
 *
 * @returns {SelectInputStore} The store for managing select input state.
 * @example
 * const { sortBy, type, setSortBy, setType } = useSelectInputStore();
 */

interface SelectInputStore {
  sortBy: string;
  type: string;
  setSortBy: (sortBy: string) => void;
  setType: (type: string) => void;
}

export const useSelectInputStore = create<SelectInputStore>()(
  persist(
    (set) => ({
      sortBy: "",
      type: "",
      setSortBy: (sortBy: string) => set({ sortBy }),
      setType: (type: string) => set({ type }),
    }),
    {
      name: "select-input-store",
      storage: createJSONStorage(() => localforage),
    }
  )
);
