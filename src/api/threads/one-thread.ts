import api from "@/api/axios-instance";
import type { Threads } from "@/types/threads";
import { useQuery } from "@tanstack/react-query";
import type { ResponseError, Response } from "@/types/response";

/**
 * Fetches a single thread by its ID.
 *
 * @param {string} threadId - The ID of the thread to fetch.
 * @returns {Promise<Response<Threads>>} A promise that resolves to the thread data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const getOneThread = async (
  threadId: string
): Promise<Response<Threads>> => {
  try {
    const response = await api.get<Response<Threads>>(`/threads/${threadId}`);

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Thread fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch a single thread by its ID using React Query.
 *
 * @param {string} threadId - The ID of the thread to fetch.
 * @returns {UseQueryResult<Response<Threads>, ResponseError>} The query result containing the thread data or error.
 * @example
 * const { data: thread, isLoading } = useGetOneThread('123');
 */

export const useGetOneThread = (threadId: string) => {
  return useQuery<Response<Threads>, ResponseError>({
    queryKey: ["one-thread", threadId],
    queryFn: () => getOneThread(threadId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
