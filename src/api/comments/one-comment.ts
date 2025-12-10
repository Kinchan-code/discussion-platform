import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";

import type { ResponseError, Response } from "@/types/response";
import type { Comments } from "@/types/comments";

/**
 * Fetches a single comment by its ID.
 *
 * @description This function retrieves a specific comment by its ID.
 *
 * @param {string} commentId - The ID of the comment to fetch.
 *
 * @return {Promise<Response<Comments>>} A promise that resolves to the comment data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const getOneComment = async (
  commentId: string
): Promise<Response<Comments>> => {
  try {
    const response = await api.get<Response<Comments>>(
      `/comments/${commentId}`
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Comment fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch a single comment by its ID using React Query.
 *
 * @param {string} commentId - The ID of the comment to fetch.
 * @returns {UseQueryResult<Response<Comments>, ResponseError>} The query result containing the comment data or error.
 * @example
 * const { data: comment, isLoading } = useGetOneComment('123');
 */

export const useGetOneComment = (commentId: string) => {
  return useQuery<Response<Comments>, ResponseError>({
    queryKey: ["comment", commentId],
    queryFn: () => getOneComment(commentId),
    refetchOnWindowFocus: false,
    enabled: !!commentId, // Only run query if commentId exists
  });
};
