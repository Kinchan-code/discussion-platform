import api from "@/api/axios-instance";
import { type Threads } from "@/types/threads";
import { useQuery } from "@tanstack/react-query";
import { type ResponseError, type Response } from "@/types/response";

/**
 * Fetches trending threads from the server.
 *
 * @returns {Promise<Response<Threads[]>>} A promise that resolves to the trending threads data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const trendingThreads = await getTrending();
 */
export const getTrending = async (): Promise<Response<Threads[]>> => {
  try {
    const response = await api.get<Response<Threads[]>>("/threads/trending", {
      params: {
        per_page: 4,
      },
    });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Trending fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch trending threads using React Query.
 *
 * @returns {UseQueryResult<Response<Threads[]>, ResponseError>} The query result containing trending threads data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetTrending();
 */
export const useGetTrending = () => {
  return useQuery<Response<Threads[]>, ResponseError>({
    queryKey: ["trending"],
    queryFn: getTrending,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
