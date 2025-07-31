import api from '@/api/axios-instance';
import { useVoteThreadStore } from '@/store/vote-thread-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Response, ResponseError } from '@/models/response';
import type { VoteThreads } from '@/models/threads';

/**
 * Votes on a thread.
 *
 * @param {string} threadId - The ID of the thread to vote on.
 * @param {string} vote - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<VoteThreads>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteThread = async (
  threadId: string,
  vote: 'upvote' | 'downvote'
): Promise<Response<VoteThreads>> => {
  try {
    const response = await api.post<Response<VoteThreads>>(
      `/threads/${threadId}/vote`,
      { type: vote }
    );

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
 * @returns {UseMutationResult<Response<VoteThreads>, ResponseError, { threadId: string; vote: 'upvote' | 'downvote' }>} The mutation result containing the vote response or error.
 * @example
 * const { mutateAsync: voteThread } = useVoteThread();
 * await voteThread({ threadId: '123', vote: 'upvote' });
 */

export const useVoteThread = () => {
  const queryClient = useQueryClient();
  const { setVote } = useVoteThreadStore();
  return useMutation<
    Response<VoteThreads>,
    ResponseError,
    {
      threadId: string;
      vote: 'upvote' | 'downvote';
    }
  >({
    mutationKey: ['vote-thread'],
    mutationFn: ({ threadId, vote }) => voteThread(threadId, vote),
    onSuccess: (data) => {
      // Check if vote was removed or added based on response structure and message
      const isVoteRemoved = !data.data.vote || data.message.includes('removed');

      if (isVoteRemoved) {
        // Vote was removed - set to null
        setVote(data.data.thread.id, null);
      } else {
        // Vote was added or changed
        setVote(data.data.thread.id, data.data.vote.type);
      }

      queryClient.invalidateQueries({
        queryKey: ['threads'],
      });
      queryClient.invalidateQueries({
        queryKey: ['threads-protocol'],
      });
      queryClient.invalidateQueries({
        queryKey: ['threads-infinite'],
      });
      queryClient.invalidateQueries({
        queryKey: ['one-thread'],
      });
    },
  });
};
