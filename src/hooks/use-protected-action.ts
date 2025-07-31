import { useLocation } from 'react-router-dom';

import { useAuthModalStore } from '@/store/auth-modal-store';
import { useAuthStore } from '@/store/auth-store';

/**
 * useProtectedAction Hook
 *
 * @description Provides a way to execute actions that require user authentication.
 * If the user is not authenticated, it opens an authentication modal.
 *
 * components used:
 * - useAuthModalStore - for managing the authentication modal state.
 * - useAuthStore - for accessing authentication state and actions.
 *
 * @param {function} action - The action to be executed if the user is authenticated.
 * @param {function} checkAuthenticationOnly - Checks if the user is authenticated without executing an action.
 * @param {boolean} isAuthenticated - Indicates if the user is currently authenticated.
 * @param {function} requireAuth - Function to set the path that requires authentication.
 * @param {Object} location - The current location object from the router.
 * @param {function} setOpen - Function to open the authentication modal.
 *
 * @returns {Object} An object containing methods to execute protected actions and check authentication.
 * @example
 * const { executeProtectedAction, checkAuthenticationOnly, isAuthenticated } = useProtectedAction();
 * executeProtectedAction(() => {
 *   // Your protected action code here
 * });
 */

export function useProtectedAction() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const requireAuth = useAuthStore((state) => state.requireAuth);
  const location = useLocation();
  const { setOpen } = useAuthModalStore();

  const executeProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      // Save current path for redirect after login
      requireAuth(location.pathname);

      // Open the modal
      setOpen(true);
      return;
    }

    // User is authenticated, execute the protected action
    action();
  };

  const checkAuthenticationOnly = () => {
    if (!isAuthenticated) {
      requireAuth(location.pathname);
      return false;
    }
    return true;
  };

  return {
    executeProtectedAction,
    checkAuthenticationOnly,
    isAuthenticated,
  };
}
