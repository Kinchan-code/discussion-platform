import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Response, ResponseError } from "@/types/response";
import type { Vote } from "@/types/vote";
import { VoteType, VotableType } from "@/enums/vote-type-enums";

/**
 * Votes on a thread.
 *
 * @param {string} votableId - The ID of the votable item to vote on.
 * @param {VoteType} voteType - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<Vote>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteThread = async (
  votableId: string,
  voteType: VoteType
): Promise<Response<Vote>> => {
  try {
    const response = await api.post<Response<Vote>>(`/votes`, {
      votable_id: votableId,
      votable_type: VotableType.THREAD,
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
      throw new Error(`Vote thread failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to vote on a thread using React Query.
 *
 * @returns {UseMutationResult<Response<Votes>, ResponseError, { votableId: string; voteType: VoteType }>} The mutation result containing the vote response or error.
 * @example
 * const { mutateAsync: voteThread } = useVoteThread();
 * await voteThread({ votableId: "123", voteType: VoteType.UPVOTE });
 */

export const useVoteThread = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Vote>,
    ResponseError,
    {
      votableId: string;
      voteType: VoteType;
    }
  >({
    mutationKey: ["vote-thread"],
    mutationFn: ({ votableId, voteType }) => voteThread(votableId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["threads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["threads-protocols-infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["threads-infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["one-thread"],
      });
    },
    onError: (error) => {
      console.error("Vote API Error:", error);
    },
  });
};
