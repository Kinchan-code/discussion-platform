import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { Protocols } from "@/types/protocols";
import type { Response, ResponseError } from "@/types/response";

/**
 * Fetches protocols based on the provided parameters.
 *
 * @param {QueryParams} params - The parameters for fetching protocols.
 * @returns {Promise<Response<Protocols[]>>} A promise that resolves to the protocols data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const protocols = await getProtocols({ params: { sort: 'recent', tags: 'web3', page: 1 } });
 */

interface Params {
  sort: string;
  tags: string;
  author?: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

export const getProtocols = async ({
  params,
}: QueryParams): Promise<Response<Protocols[]>> => {
  try {
    const response = await api.get<Response<Protocols[]>>("/protocols", {
      params: {
        author: params.author,
        per_page: params.perPage || 12,
        sort: params.sort,
        tags: params.tags,
        page: params.page,
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
      throw new Error(`Protocols fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch protocols using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching protocols.
 * @returns {UseQueryResult<Response<Protocols[]>, ResponseError>} The query result containing protocols data or error.
 * @example
 * const { data, error, isLoading } = useGetProtocols({ params: { sort: 'recent', tags: 'web3' } });
 */

export const useGetProtocols = ({ params }: QueryParams) => {
  return useQuery<Response<Protocols[]>, ResponseError>({
    queryKey: ["protocols", params.sort, params.tags, params.author],
    queryFn: () => getProtocols({ params }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch protocols with infinite scrolling using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching protocols.
 * @returns {UseInfiniteQueryResult<Response<Protocols[]>, ResponseError>} The query result containing protocols data or error.
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetProtocolsInfinite({ params: { sort: 'recent', tags: 'web3' } });
 */

export const useGetProtocolsInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Protocols[]>, ResponseError>({
    queryKey: ["protocols-infinite", params.sort, params.tags, params.author],
    queryFn: ({ pageParam = 1 }) =>
      getProtocols({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
