import api from '@/api/axios-instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Replies } from '@/models/replies';
import type { Response, ResponseError } from '@/models/response';

/**
 * Creates a reply to a comment.
 *
 * @param {string} commentId - The ID of the comment to reply to.
 * @param {string} body - The content of the reply.
 * @returns {Promise<Response<Replies>>} A promise that resolves to the created reply data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const createReply = async (
  commentId: string,
  body: string
): Promise<Response<Replies>> => {
  try {
    const response = await api.post<Response<Replies>>(
      `/comments/${commentId}/reply`,
      { body }
    );

    const data = response.data;

    if (data.status_code !== 201) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Create reply failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a reply to a comment using React Query.
 *
 * @param {function} onSuccess - Optional callback to run after successful reply creation.
 * @returns {UseMutationResult<Response<Replies>, ResponseError, { commentId: string; body: string }>} The mutation result containing the reply data or error.
 * @example
 * const { mutateAsync: createReply } = useCreateReply();
 * await createReply({ commentId: '123', body: 'This is a reply' });
 */

export const useCreateReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Replies>,
    ResponseError,
    {
      commentId: string;
      body: string;
    }
  >({
    mutationKey: ['create-reply'],
    mutationFn: ({ commentId, body }) => createReply(commentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments-infinite'],
      });
      onSuccess?.();
    },
  });
};
