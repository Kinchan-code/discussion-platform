import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import api from '@/api/axios-instance';

import type { User } from '@/models/login';

/**
 * AuthStore
 * @description This store manages the authentication state of the user.
 *
 * components used:
 * - Zustand: For state management.
 * - Persist: To persist the authentication state across sessions.
 *
 * @returns {AuthStore} The store for managing authentication state.
 * @example
 * const { isAuthenticated, login, logout } = useAuthStore();
 */

interface AuthStore {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  redirectPath: string | null;

  // Actions
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRedirectPath: (path: string | null) => void;

  // Auth methods
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  requireAuth: (currentPath: string) => boolean;
  getRedirectPath: () => string | null;
  clearRedirectPath: () => void;

  // Debug utilities
  debugTokenStatus: () => {
    storeToken: string | null;
    localStorageToken: string | null;
    isInSync: boolean;
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      redirectPath: null,

      // State setters
      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
        // Also update localStorage directly for immediate persistence
        if (!authenticated) {
          localStorage.removeItem('token');
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        // Also store in localStorage directly for immediate persistence
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },
      setRedirectPath: (path) => set({ redirectPath: path }),

      // Auth methods
      login: (token, user) => {
        // Store token in localStorage immediately
        localStorage.setItem('token', token);
        set({
          isAuthenticated: true,
          token,
          user,
          redirectPath: null, // Clear redirect after successful login
        });
      },

      logout: () => {
        // Remove token from localStorage immediately
        localStorage.removeItem('token');
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          redirectPath: null,
        });
      },

      checkAuth: async () => {
        const { setAuthenticated, setLoading, setUser, logout } = get();

        try {
          // First check localStorage directly for token
          const storedToken = localStorage.getItem('token');
          const currentToken = get().token;
          const token = storedToken || currentToken;

          if (!token) {
            setAuthenticated(false);
            setLoading(false);
            return;
          }

          // Update store with token from localStorage if different
          if (storedToken && storedToken !== currentToken) {
            set({ token: storedToken });
          }

          // Call profile API to validate token
          const response = await api.get('/profile');

          if (response.data.status_code === 200) {
            // Token is valid, user is authenticated
            setAuthenticated(true);
            setUser(response.data.data.user || response.data.data); // Adjust based on your API response
          } else {
            // Token is invalid
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        } finally {
          setLoading(false);
        }
      },

      requireAuth: (currentPath) => {
        const { setRedirectPath } = get();
        setRedirectPath(currentPath);
        return false; // Return false to indicate auth is required
      },

      getRedirectPath: () => {
        return get().redirectPath;
      },

      clearRedirectPath: () => {
        set({ redirectPath: null });
      },

      debugTokenStatus: () => {
        const storeToken = get().token;
        const localStorageToken = localStorage.getItem('token');
        return {
          storeToken,
          localStorageToken,
          isInSync: storeToken === localStorageToken,
        };
      },
    }),
    {
      name: 'auth-storage',
      // Persist all important auth data
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        redirectPath: state.redirectPath,
      }),
      // Custom storage implementation to ensure token is always in sync
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              // Ensure token is in sync with localStorage
              const directToken = localStorage.getItem('token');
              if (directToken && parsed.state.token !== directToken) {
                parsed.state.token = directToken;
              }
              return parsed;
            } catch {
              return null;
            }
          }
          return null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
