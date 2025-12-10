import api from "@/api/axios-instance";
import { type Protocols } from "@/types/protocols";
import { useQuery } from "@tanstack/react-query";
import { type ResponseError, type Response } from "@/types/response";

/**
 * Fetches featured protocols from the server.
 *
 * @returns {Promise<Response<Protocols[]>>} A promise that resolves to the featured protocols data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const featuredProtocols = await getFeaturedProtocols();
 */
export const getFeaturedProtocols = async (): Promise<
  Response<Protocols[]>
> => {
  try {
    const response = await api.get<Response<Protocols[]>>(
      "/protocols/featured",
      {
        params: {
          per_page: 6,
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
      throw new Error(`Featured protocols fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch featured protocols using React Query.
 *
 * @returns {UseQueryResult<Response<Protocols[]>, ResponseError>} The query result containing featured protocols data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetFeaturedProtocols();
 */

export const useGetFeaturedProtocols = () => {
  return useQuery<Response<Protocols[]>, ResponseError>({
    queryKey: ["featured-protocols"],
    queryFn: getFeaturedProtocols,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
