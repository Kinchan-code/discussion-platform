import api from '@/api/axios-instance';
import { useVoteReviewStore } from '@/store/vote-review-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { VoteReview } from '@/models/reviews';
import type { Response } from '@/models/response';

/**
 * Votes on a review.
 *
 * @param {number} reviewId - The ID of the review to vote on.
 * @param {string} vote - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<VoteReview>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteReview = async (
  reviewId: number,
  vote: 'upvote' | 'downvote'
) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/vote`, {
      type: vote,
    });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Vote failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to vote on a review using React Query.
 *
 * @param {number} reviewId - The ID of the review to vote on.
 * @returns {UseMutationResult<Response<VoteReview>, ResponseError, { vote: 'upvote' | 'downvote' }>} The mutation result containing the vote response or error.
 *
 * @example
 * const { mutateAsync, isPending } = useVoteReview(123);
 */

export const useVoteReview = (reviewId: number) => {
  const queryClient = useQueryClient();
  const { setVote } = useVoteReviewStore();

  return useMutation({
    mutationKey: ['vote-review', reviewId],
    mutationFn: ({ vote }: { vote: 'upvote' | 'downvote' }) =>
      voteReview(reviewId, vote),
    onSuccess: (data: Response<VoteReview>) => {
      // Update the store with the actual server response
      setVote(reviewId, data.data.user_vote);
      queryClient.invalidateQueries({ queryKey: ['reviews-by-protocol'] });
      queryClient.invalidateQueries({ queryKey: ['reviews-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews-infinite'] });
    },
    onError: (error) => {
      console.error('Vote API Error:', error);
    },
  });
};
