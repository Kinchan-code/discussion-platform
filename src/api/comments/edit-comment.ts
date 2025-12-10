import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Comments } from "@/types/comments";
import type { Response, ResponseError } from "@/types/response";

/**
 * Updates a comment.
 *
 * @param {string} commentId - The ID of the comment to update.
 * @param {string} body - The new content of the comment.
 * @returns {Promise<Response<Comments>>} A promise that resolves to the updated comment data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const updateComment = async (
  commentId: string,
  body: string
): Promise<Response<Comments>> => {
  try {
    const response = await api.put<Response<Comments>>(
      `/comments/${commentId}`,
      { body }
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Update comment failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit a comment using React Query.
 *
 * @param {function} onSuccess - Optional callback to run after successful comment update.
 * @returns {UseMutationResult<Response<Comments>, ResponseError, { commentId: string; body: string }>} The mutation result containing the updated comment data or error.
 * @example
 * const { mutateAsync: editComment } = useEditComment();
 * await editComment({ commentId: '123', body: 'Updated comment content' });
 */

export const useEditComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Comments>,
    ResponseError,
    {
      commentId: string;
      body: string;
    }
  >({
    mutationKey: ["update-comment"],
    mutationFn: ({ commentId, body }) => updateComment(commentId, body),
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
