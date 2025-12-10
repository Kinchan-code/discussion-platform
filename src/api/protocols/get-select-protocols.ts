import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";

import type { Protocols } from "@/types/protocols";
import type { ResponseError, Response } from "@/types/response";

/**
 * Fetches protocols for filters.
 *
 * @returns {Promise<Response<Protocols[]>>} A promise that resolves to the protocols data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const protocols = await getProtocolsFilters();
 */

export const getProtocolsFilters = async (): Promise<Response<Protocols[]>> => {
  try {
    const response = await api.get<Response<Protocols[]>>("/protocols/filters");

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
 * Custom hook to fetch protocols for filters using React Query.
 *
 * @returns {UseQueryResult<Response<Protocols[]>, ResponseError>} The query result containing protocols data or error.
 * @example
 * const { data, isLoading, error } = useGetProtocolsFilters();
 */

export const useGetProtocolsFilters = () => {
  return useQuery<Response<Protocols[]>, ResponseError>({
    queryKey: ["filter-protocols"],
    queryFn: getProtocolsFilters,
    refetchOnWindowFocus: false,
  });
};
