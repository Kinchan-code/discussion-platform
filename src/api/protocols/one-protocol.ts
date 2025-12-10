import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";

import type { Response, ResponseError } from "@/types/response";
import type { Protocols } from "@/types/protocols";

/**
 * Fetches a single protocol by its ID.
 *
 * @param {string} protocolId - The ID of the protocol to fetch.
 * @returns {Promise<Response<Protocols>>} A promise that resolves to the protocol data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const protocol = await getOneProtocol('123');
 */

export const getOneProtocol = async (
  protocolId: string
): Promise<Response<Protocols>> => {
  try {
    const response = await api.get<Response<Protocols>>(
      `/protocols/${protocolId}`
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Protocol fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch a single protocol using React Query.
 *
 * @param {string} protocolId - The ID of the protocol to fetch.
 * @returns {UseQueryResult<Response<Protocols>, ResponseError>} The query result containing protocol data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetOneProtocol('123');
 */

export const useGetOneProtocol = (protocolId: string) => {
  return useQuery<Response<Protocols>, ResponseError>({
    queryKey: ["one-protocol", protocolId],
    queryFn: () => getOneProtocol(protocolId),
    refetchOnWindowFocus: false,
    retry: 1, // Retry once on failure
    enabled: !!protocolId, // Only run query if protocolId exists
  });
};
