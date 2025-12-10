import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "@/lib/localforage";

/**
 * ProfileStore
 * @description This store manages the state of the profile modal.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the profile modal state across sessions.
 *
 * @returns {ProfileStore} The store for managing the profile modal state.
 * @example
 * const { isOpen, setOpen } = useProfileStore();
 */

export interface ProfileStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "profile-modal-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
