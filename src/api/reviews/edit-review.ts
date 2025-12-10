import api from "@/api/axios-instance";
import { useReviewStore } from "@/store/review-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Response, ResponseError } from "@/types/response";
import type { Reviews } from "@/types/reviews";

/**
 * Creates a new review for a protocol.
 *
 * @description This function sends a PUT request to the API to edit an existing review.
 * It handles network errors and API errors, throwing an error with a message if the request fails.
 *
 * @param {string} reviewId - The ID of the review to edit.
 * @param {CreateReview} review - The review data to be edited.
 *
 * @return {Promise<Response<Reviews>>} The response containing the edited review data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const editedReview = await editReview('12345', { body: { rating: 5, feedback: 'Great protocol!' } }); *
 */

interface CreateReviewBody {
  rating: number;
  feedback?: string;
}

interface CreateReview {
  body: CreateReviewBody;
}

export const editReview = async (
  reviewId: string,
  review: CreateReview
): Promise<Response<Reviews>> => {
  try {
    const response = await api.put<Response<Reviews>>(
      `/reviews/${reviewId}`,
      review.body
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Edit review failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit a review using React Query.
 *
 * @param {string} reviewId - The ID of the review to edit.
 * @param {function} onSuccess - Optional callback function to be called on successful edit.
 *
 * @returns {UseMutationResult<Response<Reviews>, ResponseError, CreateReview>} The mutation result.
 *
 * @example
 * const { mutateAsync: editReview } = useEditReview(reviewId, onSuccess);
 */

export const useEditReview = (reviewId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { setSelectedReview, setOpenEdit } = useReviewStore();

  return useMutation<Response<Reviews>, ResponseError, CreateReview>({
    mutationKey: ["edit-review", reviewId],
    mutationFn: (review) => editReview(reviewId, review),
    onSuccess: (data) => {
      // Optionally invalidate queries or update state after successful creation
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["reviews-infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reviews-infinite"],
      });

      setOpenEdit(false);
      setSelectedReview(data.data);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
