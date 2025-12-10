import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VotableType, VoteType } from "@/enums/vote-type-enums";
import type { Vote } from "@/types/vote";
import type { Response, ResponseError } from "@/types/response";

/**
 * Votes on a reply.
 *
 * @param {number} votableId - The ID of the votable item to vote on.
 * @param {VoteType} voteType - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<Vote>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteReply = async (
  votableId: number,
  voteType: VoteType
): Promise<Response<Vote>> => {
  try {
    const response = await api.post<Response<Vote>>("/votes", {
      votable_id: votableId,
      votable_type: VotableType.REPLY,
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
      throw new Error(`Vote reply failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to vote on a reply using React Query.
 *
 * @returns {UseMutationResult<Response<Vote>, ResponseError, { votableId: number; voteType: VoteType }>} The mutation result containing the vote response or error.
 * @example
 * const { mutateAsync: voteReply } = useVoteReply();
 * await voteReply({ votableId: 123, voteType: VoteType.UPVOTE });
 */

export const useVoteReply = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Vote>,
    ResponseError,
    {
      votableId: number;
      voteType: VoteType;
    }
  >({
    mutationKey: ["vote-reply"],
    mutationFn: ({ votableId, voteType }) => voteReply(votableId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies-infinite"],
      });
    },
    onError: (error) => {
      console.error("Vote API Error:", error);
    },
  });
};
