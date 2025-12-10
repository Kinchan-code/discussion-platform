import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * deleteReview
 *
 * @description Deletes a review by its ID from the server.
 *
 * components used:
 * - api (Axios instance)
 *
 * @param {number} reviewId - The ID of the review to delete.
 *
 * @returns {Promise<any>} The API response data if deletion is successful.
 * @throws {Error} If the response status is not 200 or the request fails.
 * @example
 * await deleteReview(789);
 */
export const deleteReview = async (reviewId: string) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message || "Failed to delete review");
    }

    return data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

/**
 * useDeleteReview
 *
 * @description Custom React Query hook to delete a review and invalidate related queries.
 *
 * components used:
 * - useMutation (React Query)
 * - useQueryClient (React Query)
 *
 * @returns {ReturnType<typeof useMutation>} A mutation object for triggering the deletion.
 *
 * @example
 * const deleteReview = useDeleteReview();
 * deleteReview.mutate(789);
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-review"],
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] });
    },
  });
};
