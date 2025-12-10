import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Threads } from "@/types/threads";
import type { ResponseError, Response } from "@/types/response";
import type { CreateThreadSchemaType } from "@/features/threads/pages/create-thread/schema/create-thread-schema";

/**
 * Updates an existing thread.
 *
 * @param {string} threadId - The ID of the thread to update.
 * @param {CreateThreadSchemaType} query - The data to update the thread with.
 * @returns {Promise<Response<Threads>>} A promise that resolves to the updated thread data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const editThread = async (
  threadId: string,
  query: CreateThreadSchemaType
): Promise<Response<Threads>> => {
  try {
    const response = await api.put<Response<Threads>>(
      `/threads/${threadId}`,
      query
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Thread update failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit a thread using React Query.
 *
 * @param {string} threadId - The ID of the thread to edit.
 * @param {function} onSuccess - Optional callback function to be called on successful thread edit.
 * @returns {UseMutationResult<Response<Threads>, ResponseError, CreateThreadSchemaType>} The mutation result containing the updated thread data or error.
 * @example
 * const { mutateAsync: editThread } = useEditThread('123');
 * await editThread({ title: 'Updated Thread', content: 'Updated content' });
 */

export const useEditThread = (threadId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<Response<Threads>, ResponseError, CreateThreadSchemaType>({
    mutationKey: ["edit-thread", threadId],
    mutationFn: (params) => editThread(threadId, params),
    onSuccess: () => {
      // Invalidate threads query to refetch after editing a thread
      queryClient.invalidateQueries({ queryKey: ["threads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["one-thread"] });
      // Optionally, you can redirect or show a success message here
      onSuccess?.();
    },
  });
};
