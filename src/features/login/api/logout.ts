import api from '@/api/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { PathName } from '@/models/path-enums';

import { useHeaderStore } from '@/store/header-store';
import { useVoteThreadStore } from '@/store/vote-thread-store';
import { useVoteReviewStore } from '@/store/vote-review-store';
import { useVoteCommentStore } from '@/store/vote-comment-store';

/**
 * API call to log out user
 *
 * @returns {Promise<Response>} - Promise resolving to the logout response
 */

export const logoutApi = async () => {
  try {
    const response = await api.post('/logout');

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error('L Failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to handle user logout
 *
 * @returns {UseMutationResult<Response, Error>} - Mutation result for logout
 *
 * @example
 * const { mutate: logout } = useLogout();
 * logout();
 */

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { setIsOpen } = useHeaderStore();

  // Helper to clear all relevant persisted Zustand stores and in-memory state
  const clearPersistedStores = () => {
    // Auth store is cleared by logout()
    localStorage.removeItem('review-store');
    localStorage.removeItem('reply-store');
    localStorage.removeItem('vote-thread-storage');
    localStorage.removeItem('vote-review-storage');
    localStorage.removeItem('vote-comment-storage');
    localStorage.removeItem('thread-storage');
    localStorage.removeItem('profile-modal-storage');
    localStorage.removeItem('filters-storage');
    localStorage.removeItem('select-input-store');
    localStorage.removeItem('search-dialog-store');
    // Optionally clear header and auth modal state if you want a full reset:
    // localStorage.removeItem('header-store');
    // localStorage.removeItem('auth-modal-storage');

    // Also clear in-memory Zustand state for votes (prevents stale UI after logout)
    useVoteThreadStore.setState({ vote: {} });
    useVoteReviewStore.setState({ votes: {} });
    useVoteCommentStore.setState({ votes: {} });
  };

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      logout();
      clearPersistedStores();
      navigate(PathName.HOMEPAGE);
      setIsOpen(false);
    },
    onError: () => {
      logout();
      clearPersistedStores();
      navigate(PathName.LOGIN);
    },
  });
};
