import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reply } from "@/types/replies";
import type { Response, ResponseError } from "@/types/response";

/**
 * Updates a reply.
 *
 * @param {string} replyId - The ID of the reply to update.
 * @param {string} body - The new content of the reply.
 * @returns {Promise<Response<Reply>>} A promise that resolves to the updated reply data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const updateReply = async (
  replyId: string,
  body: string
): Promise<Response<Reply>> => {
  try {
    const response = await api.put<Response<Reply>>(`/replies/${replyId}`, {
      body,
    });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Update reply failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit a reply using React Query.
 *
 * @param {function} onSuccess - Optional callback to run after successful reply update.
 * @returns {UseMutationResult<Response<Reply>, ResponseError, { replyId: string; body: string }>} The mutation result containing the updated reply data or error.
 * @example
 * const { mutateAsync: editReply } = useEditReply();
 * await editReply({ replyId: '123', body: 'Updated reply content' });
 */

export const useEditReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Reply>,
    ResponseError,
    {
      replyId: string;
      body: string;
    }
  >({
    mutationKey: ["update-reply"],
    mutationFn: ({ replyId, body }) => updateReply(replyId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies-infinite"],
      });
      onSuccess?.();
    },
  });
};
