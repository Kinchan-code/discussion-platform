import api from '@/api/axios-instance';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { PathName } from '@/models/path-enums';
import { useHeaderStore } from '@/store/header-store';

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

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      // Use the auth store's logout method which handles everything
      logout();
      // Redirect to login page after logout
      navigate(PathName.HOMEPAGE);
      setIsOpen(false); // Close the header menu if open
    },
    onError: () => {
      // Even if API fails, log out locally
      logout();
      navigate(PathName.LOGIN);
    },
  });
};
