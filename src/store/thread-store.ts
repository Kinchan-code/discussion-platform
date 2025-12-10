import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * ThreadStore
 * @description This store manages the state of the currently selected thread.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the thread selection across sessions.
 *
 * @returns {ThreadStore} The store for managing thread selection state.
 * @example
 * const { selectedThreadTitle, setSelectedThread } = useThreadStore();
 */

export interface ThreadStore {
  selectedThreadTitle: string | null; // Currently selected thread title
  setSelectedThread: (title: string | null) => void; // Function to set the selected thread title
}

export const useThreadStore = create<ThreadStore>()(
  persist(
    (set) => ({
      selectedThreadTitle: null,
      setSelectedThread: (title) => set({ selectedThreadTitle: title }),
    }),
    {
      name: "thread-storage", // Name of the storage key
      storage: createJSONStorage(() => localforage),
    }
  )
);
