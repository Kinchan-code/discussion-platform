import api from '@/api/axios-instance';
import { type Tags } from '@/models/tags';
import { useQuery } from '@tanstack/react-query';
import { type ResponseError, type Response } from '@/models/response';

/**
 * Fetches popular tags from the server.
 *
 * @returns {Promise<Response<Tags[]>>} A promise that resolves to the popular tags data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const popularTags = await getPopularTags();
 */
export const getPopularTags = async (): Promise<Response<Tags[]>> => {
  try {
    const response = await api.get<Response<Tags[]>>('/tags/popular');

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Popular tags fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch popular tags using React Query.
 *
 * @returns {UseQueryResult<Response<Tags[]>, ResponseError>} The query result containing popular tags data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetPopularTags();
 */
export const useGetPopularTags = () => {
  return useQuery<Response<Tags[]>, ResponseError>({
    queryKey: ['popular-tags'],
    queryFn: getPopularTags,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
