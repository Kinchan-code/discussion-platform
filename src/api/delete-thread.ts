import api from '@/api/axios-instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * deleteThread
 *
 * @description Deletes a thread by its ID from the server.
 *
 * components used:
 * - api (Axios instance)
 *
 * @param {number} threadId - The ID of the thread to delete.
 *
 * @returns {Promise<any>} The API response data if deletion is successful.
 * @throws {Error} If the response status is not 200 or the request fails.
 * @example
 * await deleteThread(321);
 */
export const deleteThread = async (threadId: number) => {
  try {
    const response = await api.delete(`/threads/${threadId}`);
    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message || 'Failed to delete thread');
    }

    return data;
  } catch (error) {
    console.error('Error deleting thread:', error);
    throw error;
  }
};

/**
 * useDeleteThread
 *
 * @description Custom React Query hook to delete a thread and invalidate related queries.
 *
 * components used:
 * - useMutation (React Query)
 * - useQueryClient (React Query)
 *
 * @param {() => void} [onSuccess] Optional callback executed after a successful deletion.
 *
 * @returns {ReturnType<typeof useMutation>} A mutation object for triggering the deletion.
 *
 * @example
 * const deleteThread = useDeleteThread(() => {
 *   console.log('Thread deleted successfully');
 * });
 * deleteThread.mutate(321);
 */
export const useDeleteThread = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-thread'],
    mutationFn: (threadId: number) => deleteThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['one-thread'] });
      queryClient.invalidateQueries({
        queryKey: ['threads-protocols-infinite'],
      });
      queryClient.invalidateQueries({ queryKey: ['user-statistics'] });
      onSuccess?.();
    },
  });
};
