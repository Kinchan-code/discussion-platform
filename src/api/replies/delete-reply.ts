import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * deleteReply
 *
 * @description Deletes a specific reply by its ID from the server.
 *
 * components used:
 * - api (Axios instance)
 * - useMutation (React Query)
 *
 * @param {string} replyId - The ID of the reply to delete.
 *
 * @returns {Promise<any>} The API response data if deletion is successful.
 * @throws {Error} If the response status is not 200 or the request fails.
 * @example
 * await deleteReply(123);
 */
export const deleteReply = async (replyId: string) => {
  try {
    const response = await api.delete(`/replies/${replyId}`);
    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message || "Failed to delete reply");
    }

    return data;
  } catch (error) {
    console.error("Error deleting reply:", error);
    throw error;
  }
};

/**
 * useDeleteReply
 *
 * @description Custom React Query hook to delete a reply and invalidate related queries.
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
 * const deleteReply = useDeleteReply(() => {
 *   console.log('Reply deleted successfully');
 * });
 * deleteReply.mutate(123);
 */
export const useDeleteReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-reply"],
    mutationFn: (replyId: string) => deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-replies-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] });
      onSuccess?.();
    },
  });
};
