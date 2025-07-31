import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * HeaderStore
 * @description This store manages the state of the header, including its open/close status and active link.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the header state across sessions.
 *
 * @returns {HeaderStore} The store for managing the header state.
 * @example
 * const { isOpen, setIsOpen, toggleOpen, activeLink, setActiveLink } = useHeaderStore();
 */

interface HeaderStore {
  isOpen: boolean;
  activeLink: string;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  setActiveLink: (activeLink: string) => void;
}

export const useHeaderStore = create<HeaderStore>()(
  persist(
    (set) => {
      return {
        isOpen: false,
        activeLink: '',
        setIsOpen: (isOpen: boolean) => set({ isOpen }),
        toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
        setActiveLink: (activeLink: string) => set({ activeLink }),
      };
    },
    {
      name: 'header-store',
    }
  )
);
