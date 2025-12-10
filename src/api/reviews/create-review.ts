import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReviewStore } from "@/store/review-store";

import type { Response, ResponseError } from "@/types/response";
import type { Reviews } from "@/types/reviews";

/**
 * Creates a new review for a protocol.
 * @description This function sends a POST request to create a review for a specific protocol.
 *
 * @param {string} protocolId - The ID of the protocol to create a review for.
 * @param {CreateReview} review - The review data to be created.
 *
 * @return {Promise<Response<Reviews>>} A promise that resolves to the created review data.
 *
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const newReview = await createReview('protocol123', { body: { rating: 5, feedback: 'Great protocol!' } });
 */

interface CreateReviewBody {
  rating: number;
  feedback?: string;
}

interface CreateReview {
  body: CreateReviewBody;
}

export const createReview = async (
  protocolId: string,
  review: CreateReview
): Promise<Response<Reviews>> => {
  try {
    const response = await api.post<Response<Reviews>>(
      `/protocols/${protocolId}/reviews`,
      review.body
    );

    const data = response.data;

    if (data.status_code !== 201) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Create review failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a review using React Query.
 *
 * @param {string} protocolId - The ID of the protocol to create a review for.
 * @param {function} onSuccess - Optional callback function to be called on successful creation.
 *
 * @returns {UseMutationResult<Response<Reviews>, ResponseError, CreateReview>} The mutation result.
 *
 * @example
 * const { mutateAsync: createReview } = useCreateReview(protocolId, onSuccess);
 */

export const useCreateReview = (protocolId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { setSelectedReview } = useReviewStore();

  return useMutation<Response<Reviews>, ResponseError, CreateReview>({
    mutationKey: ["create-review", protocolId],
    mutationFn: (review) => createReview(protocolId, review),
    onSuccess: (data) => {
      // Update the selected review in the store with the newly created review
      setSelectedReview(data.data);

      // Optionally invalidate queries or update state after successful creation
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["reviews-infinite"],
      });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
