import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";

import type { ResponseError, Response } from "@/types/response";
import type { Reply } from "@/types/replies";

/**
 * Fetches a single reply by its ID.
 *
 * @description This function retrieves a specific reply by its ID.
 *
 * @param {string} replyId - The ID of the reply to fetch.
 *
 * @return {Promise<Response<Reply>>} A promise that resolves to the reply data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const getOneReply = async (
  replyId: string
): Promise<Response<Reply>> => {
  try {
    const response = await api.get<Response<Reply>>(`/replies/${replyId}`);

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Reply fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch a single reply by its ID using React Query.
 *
 * @param {string} replyId - The ID of the reply to fetch.
 * @returns {UseQueryResult<Response<Reply>, ResponseError>} The query result containing the reply data or error.
 * @example
 * const { data: reply, isLoading } = useGetOneReply('123');
 */

export const useGetOneReply = (replyId: string) => {
  return useQuery<Response<Reply>, ResponseError>({
    queryKey: ["one-reply", replyId],
    queryFn: () => getOneReply(replyId),
    refetchOnWindowFocus: false,
    enabled: !!replyId, // Only run query if replyId exists
  });
};
