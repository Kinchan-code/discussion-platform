import api from '@/api/axios-instance';
import { type Protocols } from '@/models/protocols';
import { useQuery } from '@tanstack/react-query';
import { type ResponseError, type Response } from '@/models/response';

/**
 * Fetches protocols with filters from the server.
 *
 * @returns {Promise<Response<Protocols[]>>} A promise that resolves to the protocols data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const filterProtocols = await getFilterProtocols();
 */
export const getFilterProtocols = async (): Promise<Response<Protocols[]>> => {
  try {
    const response = await api.get<Response<Protocols[]>>('/protocols/filters');

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Protocols fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch protocols with filters using React Query.
 *
 * @returns {UseQueryResult<Response<Protocols[]>, ResponseError>} The query result containing protocols data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetFilterProtocols();
 */
export const useGetFilterProtocols = () => {
  return useQuery<Response<Protocols[]>, ResponseError>({
    queryKey: ['filter-protocols'],
    queryFn: getFilterProtocols,
    refetchOnWindowFocus: false,
  });
};
