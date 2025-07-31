import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * AuthModalStore
 * @description This store manages the state of the authentication modal.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the modal state across sessions.
 *
 * @returns {AuthModalStore} The store for managing the authentication modal state.
 * @example
 * const { isOpen, setOpen } = useAuthModalStore();
 */

interface AuthModalStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useAuthModalStore = create<AuthModalStore>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'auth-modal-storage', // Name of the storage key
    }
  )
);
