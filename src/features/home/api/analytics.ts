import api from '@/api/axios-instance';
import { type Analytics } from '@/models/analytics';
import { useQuery } from '@tanstack/react-query';
import { type ResponseError, type Response } from '@/models/response';

/**
 * Fetches analytics data from the server.
 *
 * @returns {Promise<Response<Analytics>>} A promise that resolves to the analytics data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const analytics = await getAnalytics();
 */

export const getAnalytics = async (): Promise<Response<Analytics>> => {
  try {
    const response = await api.get<Response<Analytics>>('/stats/dashboard');

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Analytics fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch analytics data using React Query.
 *
 * @returns {UseQueryResult<Response<Analytics>, ResponseError>} The query result containing analytics data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetAnalytics();
 */

export const useGetAnalytics = () => {
  return useQuery<Response<Analytics>, ResponseError>({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    refetchOnWindowFocus: false,
  });
};
