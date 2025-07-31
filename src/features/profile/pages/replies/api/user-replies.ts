import api from '@/api/axios-instance';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import type { Response, ResponseError } from '@/models/response';
import type { UserComments } from '@/models/profile';

/**
 * Fetches user replies from the server.
 *
 * @param {Params} params - The parameters for pagination.
 * @returns {Promise<Response<UserComments[]>>} A promise that resolves to the user replies data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const userReplies = await getUserReplies({ params: { page: 1, perPage: 10 } });
 */

interface Params {
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

export const getUserReplies = async ({
  params,
}: QueryParams): Promise<Response<UserComments[]>> => {
  try {
    const response = await api.get<Response<UserComments[]>>(
      '/profile/replies',
      {
        params: {
          per_page: params.perPage || 12,
          page: params.page,
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
      throw new Error(`Replies fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch user replies using React Query.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseQueryResult<Response<UserComments[]>, ResponseError>} The query result containing user replies data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetUserReplies({ params: { page: 1, perPage: 10 } });
 */

export const useGetUserReplies = ({ params }: QueryParams) => {
  return useQuery<Response<UserComments[]>, ResponseError>({
    queryKey: ['user-replies', params.page, params.perPage],
    queryFn: () => getUserReplies({ params }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch user replies with infinite scrolling using React Query.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseInfiniteQueryResult<Response<UserComments[]>, ResponseError>} The query result containing user replies data or error.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetUserRepliesInfinite({ params: { page: 1, perPage: 10 } });
 */

export const useGetUserRepliesInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<UserComments[]>, ResponseError>({
    queryKey: ['user-replies-infinite', params.page, params.perPage],
    queryFn: ({ pageParam = 1 }) =>
      getUserReplies({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
