import api from '@/api/axios-instance';
import { useVoteCommentStore } from '@/store/vote-comment-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { VoteComments } from '@/models/comments';
import type { Response, ResponseError } from '@/models/response';

/**
 * Votes on a comment.
 *
 * @param {string} commentId - The ID of the comment to vote on.
 * @param {string} vote - The type of vote ('upvote' or 'downvote').
 * @returns {Promise<Response<VoteComments>>} A promise that resolves to the vote response.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const voteComment = async (
  commentId: string,
  vote: 'upvote' | 'downvote'
): Promise<Response<VoteComments>> => {
  try {
    const response = await api.post<Response<VoteComments>>(
      `/comments/${commentId}/vote`,
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
 * Custom hook to vote on a comment using React Query.
 *
 * @returns {UseMutationResult<Response<VoteComments>, ResponseError, { commentId: string; vote: 'upvote' | 'downvote' }>} The mutation result containing the vote response or error.
 * @example
 * const { mutateAsync: voteComment } = useVoteComment();
 * await voteComment({ commentId: '123', vote: 'upvote' });
 */

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  const { setVote } = useVoteCommentStore();
  return useMutation<
    Response<VoteComments>,
    ResponseError,
    {
      commentId: string;
      vote: 'upvote' | 'downvote';
    }
  >({
    mutationKey: ['vote-comment'],
    mutationFn: ({ commentId, vote }) => voteComment(commentId, vote),
    onSuccess: (data) => {
      // Check if vote was removed or added based on response structure and message
      const isVoteRemoved = !data.data.vote || data.message.includes('removed');

      if (isVoteRemoved) {
        // Vote was removed - set to null
        setVote(data.data.comment.id, null);
      } else {
        // Vote was added or changed
        setVote(data.data.comment.id, data.data.vote.type);
      }

      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments-infinite'],
      });
    },
  });
};
