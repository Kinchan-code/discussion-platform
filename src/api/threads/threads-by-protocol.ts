import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { ResponseError, Response } from "@/types/response";
import type { Threads } from "@/types/threads";

/**
 * Fetches threads by protocol ID.
 *
 * @description This function retrieves threads associated with a specific protocol ID.
 *
 * @param {Query} params - The parameters for fetching threads.
 * @param {string} params.protocolId - The ID of the protocol to fetch threads for.
 * @param {number} [params.page=1] - The page number for pagination.
 * @param {number} [params.perPage=5] - The number of threads per page.
 *
 * @return {Promise<Response<Threads[]>>} A promise that resolves to the threads data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const threads = await getThreadsByProtocol({ params: { protocolId: '123', page: 1, perPage: 10 } });
 */

interface Query {
  protocolId: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Query;
}

export const getThreadsByProtocol = async ({
  params,
}: QueryParams): Promise<Response<Threads[]>> => {
  try {
    const response = await api.get<Response<Threads[]>>(
      `/protocols/${params.protocolId}/threads`,
      {
        params: { per_page: params.perPage || 5, page: params.page || 1 },
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
      throw new Error(`Protocol fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch threads by protocol ID using React Query.
 *
 * @param {string} protocolId - The ID of the protocol to fetch threads for.
 * @returns {UseQueryResult<Response<Threads[]>, ResponseError>} The query result containing threads data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetThreadsByProtocol('123');
 */

export const useGetThreadsByProtocol = (protocolId: string) => {
  return useQuery<Response<Threads[]>, ResponseError>({
    queryKey: ["threads-protocol", protocolId],
    queryFn: () => getThreadsByProtocol({ params: { protocolId } }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch threads with infinite scrolling for a specific protocol using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching threads.
 * @returns {UseInfiniteQueryResult<Response<Threads[]>, ResponseError>} The query result containing threads data or error.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetThreadsByProtocolInfinite({ params: { protocolId: '123', page: 1 } });
 */

export const useGetThreadsByProtocolInfinite = ({
  protocolId,
}: {
  protocolId: string;
}) => {
  return useInfiniteQuery<Response<Threads[]>, ResponseError>({
    queryKey: ["threads-protocols-infinite", protocolId],
    queryFn: ({ pageParam = 1 }) =>
      getThreadsByProtocol({
        params: { protocolId, page: pageParam as number },
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    enabled: !!protocolId, // Only run query if protocolId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
