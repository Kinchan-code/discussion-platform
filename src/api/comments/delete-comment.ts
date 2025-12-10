import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * deleteComment
 *
 * @description Deletes a specific comment by its ID from the server.
 *
 * components used:
 * - api (Axios instance)
 * - useMutation (React Query)
 *
 * @param {string} commentId - The ID of the comment to delete.
 *
 * @returns {Promise<any>} The API response data if deletion is successful.
 * @throws {Error} If the response status is not 200 or the request fails.
 * @example
 * await deleteComment(123);
 */
export const deleteComment = async (commentId: string) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message || "Failed to delete comment");
    }

    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

/**
 * useDeleteCommentReply
 *
 * @description Custom React Query hook to delete a comment or reply and invalidate related queries.
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
 * const deleteReply = useDeleteCommentReply(() => {
 *   console.log('Reply deleted successfully');
 * });
 * deleteReply.mutate(123);
 */
export const useDeleteComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-comments-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] });
      onSuccess?.();
    },
  });
};
