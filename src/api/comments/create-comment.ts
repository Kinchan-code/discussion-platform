import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Comments } from "@/types/comments";
import type { Response, ResponseError } from "@/types/response";

/**
 * Creates a new comment on a thread.
 *
 * @param {string} threadId - The ID of the thread to create a comment on.
 * @param {string} body - The content of the comment.
 * @returns {Promise<Response<Comments>>} A promise that resolves to the created comment data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const createComment = async (
  threadId: string,
  body: string
): Promise<Response<Comments>> => {
  try {
    const response = await api.post<Response<Comments>>(
      `/threads/${threadId}/comments`,
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
      throw new Error(`Create comment failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a comment on a thread using React Query.
 *
 * @param {function} onSuccess - Optional callback to run after successful comment creation.
 * @returns {UseMutationResult<Response<Comments>, ResponseError, { threadId: string; body: string }>} The mutation result containing the comment data or error.
 * @example
 * const { mutateAsync: createComment } = useCreateComment();
 * await createComment({ threadId: '123', body: 'This is a comment' });
 */

export const useCreateComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Comments>,
    ResponseError,
    {
      threadId: string;
      body: string;
    }
  >({
    mutationKey: ["create-comment"],
    mutationFn: ({ threadId, body }) => createComment(threadId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments-infinite"],
      });
      onSuccess?.();
    },
  });
};
