import api from '@/api/axios-instance';
import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';

import type { Response, ResponseError } from '@/models/response';
import type { EditProfileSchemaType } from '@/features/profile/schema/edit-profile-schema';
import type { User } from '@/models/login';

/**
 * Edits the user profile.
 *
 * @param {EditProfileSchemaType} user - The user profile data to be edited.
 * @returns {Promise<Response<User>>} A promise that resolves to the updated user profile data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const editProfile = async (
  user: EditProfileSchemaType
): Promise<Response<User>> => {
  try {
    const response = await api.put<Response<User>>('/profile', user);

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Create review failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit user profile using React Query.
 *
 *
 * @param {function} onSuccess - Optional callback function to be called on successful edit.
 *
 * @returns {UseMutationResult<Response<User>, ResponseError, EditProfileSchemaType>} The mutation result containing the updated user profile data or error.
 * @example
 * const { mutateAsync: editProfile } = useEditProfile();
 * await editProfile({ name: 'John Doe', email: 'john.doe@example.com' });
 */

export const useEditProfile = (onSuccess?: () => void) => {
  const { setUser } = useAuthStore();
  return useMutation<Response<User>, ResponseError, EditProfileSchemaType>({
    mutationKey: ['edit-profile'],
    mutationFn: (user) => editProfile(user),
    onSuccess: (user) => {
      // Optionally invalidate queries or update state after successful creation
      onSuccess?.();
      setUser(user.data);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
