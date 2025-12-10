import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VoteType, VotableType } from "@/enums/vote-type-enums";
import type { Vote } from "@/types/vote";
import type { Response, ResponseError } from "@/types/response";

/**
 * Votes on a review.
 *
 * @param {string} votableId - The ID of the votable item to vote on.
 * @param {VoteType} voteType - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<Vote>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteReview = async (votableId: string, voteType: VoteType) => {
  try {
    const response = await api.post<Response<Vote>>("/votes", {
      votable_id: votableId,
      votable_type: VotableType.REVIEW,
      vote_type: voteType,
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
 * @param {string} reviewId - The ID of the review to vote on.
 * @returns {UseMutationResult<Response<Vote>, ResponseError, { votableId: number; voteType: VoteType }>} The mutation result containing the vote response or error.
 *
 * @example
 * const { mutateAsync, isPending } = useVoteReview();
 * await voteReview({ votableId: "123", voteType: VoteType.UPVOTE });
 */

export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Response<Vote>,
    ResponseError,
    { votableId: string; voteType: VoteType }
  >({
    mutationKey: ["vote-review"],
    mutationFn: ({ votableId, voteType }) => voteReview(votableId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews-by-protocol"] });
      queryClient.invalidateQueries({ queryKey: ["reviews-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews-infinite"] });
    },
    onError: (error) => {
      console.error("Vote API Error:", error);
    },
  });
};
