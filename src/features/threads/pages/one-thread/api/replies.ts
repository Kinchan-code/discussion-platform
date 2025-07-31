import api from '@/api/axios-instance';
import { useQuery } from '@tanstack/react-query';

import type { ResponseError, Response } from '@/models/response';
import type { Replies } from '@/models/replies';

/**
 * Fetches replies for a specific comment.
 *
 * @param {string} commentId - The ID of the comment to fetch replies for.
 * @returns {Promise<Response<Replies>>} A promise that resolves to the replies data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const getReplies = async (
  commentId: string
): Promise<Response<Replies>> => {
  try {
    const response = await api.get<Response<Replies>>(
      `/comments/${commentId}/replies`,
      {
        params: {
          per_page: 5,
        },
      }
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Replies fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch replies for a specific comment using React Query.
 *
 * @param {string} commentId - The ID of the comment to fetch replies for.
 * @returns {UseQueryResult<Response<Replies>, ResponseError>} The query result containing the replies data or error.
 * @example
 * const { data: replies, isLoading } = useGetReplies('123');
 */

export const useGetReplies = (commentId: string) => {
  return useQuery<Response<Replies>, ResponseError>({
    queryKey: ['replies', commentId],
    queryFn: () => getReplies(commentId),
    refetchOnWindowFocus: false,
    enabled: !!commentId, // Only run query if commentId exists
  });
};
