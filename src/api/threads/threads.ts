import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { Threads } from "@/types/threads";
import type { ResponseError, Response } from "@/types/response";

/**
 * Fetches threads based on the provided parameters.
 *
 * @param {QueryParams} params - The parameters for fetching threads.
 * @returns {Promise<Response<Threads[]>>} A promise that resolves to the threads data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const threads = await getThreads({ params: { sort: 'recent', tags: 'web3', page: 1 } });
 */

interface Params {
  sort: string;
  protocol_id?: string | null;
  page?: number;
  perPage?: number;
  author?: string;
}

interface QueryParams {
  params: Params;
}

export const getThreads = async ({
  params,
}: QueryParams): Promise<Response<Threads[]>> => {
  try {
    const response = await api.get<Response<Threads[]>>("/threads", {
      params: {
        author: params.author || undefined,
        sort: params.sort,
        protocol_id: params.protocol_id || undefined,
        page: params.page || 1,
        per_page: params.perPage || 12,
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
      throw new Error(`Threads fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch threads using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching threads.
 * @returns {UseQueryResult<Response<Threads[]>, ResponseError>} The query result containing threads data or error.
 * @example
 * const { data, isLoading, error } = useGetThreads({ params: { sort: 'recent', tags: 'web3' } });
 */

export const useGetThreads = ({ params }: QueryParams) => {
  return useQuery<Response<Threads[]>, ResponseError>({
    queryKey: ["threads", params.sort, params.protocol_id],
    queryFn: () => getThreads({ params }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch threads with infinite scrolling using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching threads.
 * @returns {UseInfiniteQueryResult<Response<Threads[]>, ResponseError>} The query result containing threads data or error.
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetThreadsInfinite({ params: { sort: 'recent', tags: 'web3' } });
 */

export const useGetThreadsInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Threads[]>, ResponseError>({
    queryKey: ["threads-infinite", params.sort, params.protocol_id],
    queryFn: ({ pageParam = 1 }) =>
      getThreads({ params: { ...params, page: pageParam as number } }),
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
