import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

/**
 * AuthInitializer Component
 *
 * Initializes authentication state on app startup.
 * This replaces the AuthProvider pattern with Zustand store.
 *
 * @param {React.ReactNode} children - React nodes to render inside the component.
 * @returns AuthInitializer component
 */

interface AuthInitializerProps {
  children: React.ReactNode;
}

function AuthInitializer({ children }: AuthInitializerProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Ensure token is in sync with localStorage after hydration
      const token = localStorage.getItem('token');
      const storeToken = useAuthStore.getState().token;

      if (token && token !== storeToken) {
        setToken(token);
      }

      // Check authentication status on app startup
      checkAuth();
    }
  }, [isHydrated, checkAuth, setToken]);

  return <>{children}</>;
}

export { AuthInitializer };
