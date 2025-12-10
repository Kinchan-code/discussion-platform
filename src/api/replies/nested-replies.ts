import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Reply } from "@/types/replies";
import type { Response, ResponseError } from "@/types/response";

/**
 * Fetches nested replies for a specific reply.
 *
 * @param {string} id - The ID of the reply to fetch nested replies for.
 * @returns {Promise<Response<Reply[]>>} A promise that resolves to the nested replies data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const nestedReplies = await getNestedReplies({ params: { id: '123', page: 1, perPage: 5 } });
 */

interface Params {
  id: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

export const getNestedReplies = async ({
  params,
}: QueryParams): Promise<Response<Reply[]>> => {
  try {
    const response = await api.get<Response<Reply[]>>(
      `/replies/${params.id}/children`,
      {
        params: {
          page: params.page || 1,
          per_page: params.perPage || 5,
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
      throw new Error(`Nested replies fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch nested replies for a specific reply using React Query.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseQueryResult<Response<Reply[]>, ResponseError>} The query result containing the nested replies data or error.
 * @example
 * const { data: nestedReplies, isLoading } = useGetNestedReplies({ params: { id: '123', page: 1, perPage: 5 } });
 */

export const useGetNestedReplies = ({ params }: QueryParams) => {
  return useQuery<Response<Reply[]>, ResponseError>({
    queryKey: ["nested-replies", params.id, params.page, params.perPage],
    queryFn: () => getNestedReplies({ params }),
    refetchOnWindowFocus: false,
    enabled: !!params.id, // Only run query if id exists
  });
};

/**
 * Custom hook to fetch nested replies for a specific reply using React Query with infinite scrolling.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseInfiniteQueryResult<Response<Reply[]>, ResponseError>} The query result containing the nested replies data or error.
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetNestedRepliesInfinite({ params: { id: '123', page: 1, perPage: 5 } });
 */
export const useGetNestedRepliesInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Reply[]>, ResponseError>({
    queryKey: [
      "nested-replies-infinite",
      params.id,
      params.page,
      params.perPage,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getNestedReplies({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
