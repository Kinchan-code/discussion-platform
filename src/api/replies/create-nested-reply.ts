import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reply } from "@/types/replies";
import type { Response, ResponseError } from "@/types/response";

/**
 * Creates a nested reply to a reply.
 *
 * @param {string} replyId - The ID of the reply to create a nested reply for.
 * @param {string} body - The content of the reply.
 * @returns {Promise<Response<Reply>>} A promise that resolves to the created reply data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const createNestedReply = async (
  replyId: string,
  body: string
): Promise<Response<Reply>> => {
  try {
    const response = await api.post<Response<Reply>>(
      `/replies/${replyId}/children`,
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
      throw new Error(`Create nested reply failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a nested reply to a reply using React Query.
 *
 * @param {function} onSuccess - Optional callback to run after successful reply creation.
 * @returns {UseMutationResult<Response<Reply>, ResponseError, { replyId: string; body: string }>} The mutation result containing the nested reply data or error.
 * @example
 * const { mutateAsync: createNestedReply } = useCreateNestedReply();
 * await createNestedReply({ replyId: '123', body: 'This is a nested reply' });
 */

export const useCreateNestedReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Reply>,
    ResponseError,
    {
      replyId: string;
      body: string;
    }
  >({
    mutationKey: ["create-nested-reply"],
    mutationFn: ({ replyId, body }) => createNestedReply(replyId, body),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies-infinite"],
      });
    },
  });
};
