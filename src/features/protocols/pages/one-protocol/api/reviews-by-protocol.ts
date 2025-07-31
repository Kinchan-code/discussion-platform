import api from '@/api/axios-instance';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import type { Response, ResponseError } from '@/models/response';
import type { Reviews } from '@/models/reviews';

/**
 * Fetches reviews for a specific protocol.
 *
 * @param {Object} params - The parameters for fetching reviews.
 * @param {string} params.protocolId - The ID of the protocol to fetch reviews for.
 * @param {number} [params.page=1] - The page number for pagination.
 * @param {number} [params.perPage=5] - The number of reviews per page.
 * @param {string} [params.highlight_review=''] - Optional review ID to highlight.
 *
 * @returns {Promise<Response<Reviews[]>>} A promise that resolves to the reviews data.
 * @throws {Error} If the API request fails or returns an error response.
 */

interface Params {
  protocolId?: string;
  page?: number;
  perPage?: number;
  highlight_review?: string;
}

interface QueryParams {
  params: Params;
}

export const getReviews = async ({
  params,
}: QueryParams): Promise<Response<Reviews[]>> => {
  try {
    const response = await api.get<Response<Reviews[]>>(
      `/protocols/${params.protocolId}/reviews`,
      {
        params: {
          per_page: params.perPage || 5,
          page: params.page || 1,
          highlight_review: params.highlight_review || '',
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
      throw new Error(`Protocol fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch reviews for a specific protocol using React Query.
 *
 * @param {string} protocolId - The ID of the protocol to fetch reviews for.
 * @returns {UseQueryResult<Response<Reviews[]>, ResponseError>} The query result containing reviews data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetReviews('123');
 */

export const useGetReviews = (protocolId: string) => {
  return useQuery<Response<Reviews[]>, ResponseError>({
    queryKey: ['reviews-by-protocol', protocolId],
    queryFn: () => getReviews({ params: { protocolId } }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch reviews with infinite scrolling for a specific protocol using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching reviews.
 * @returns {UseInfiniteQueryResult<Response<Reviews[]>, ResponseError>} The query result containing reviews data or error.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetReviewsInfinite({ params: { protocolId: '123', page: 1 } });
 */

export const useGetReviewsInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Reviews[]>, ResponseError>({
    queryKey: ['reviews-infinite', params.protocolId],
    queryFn: ({ pageParam = 1 }) =>
      getReviews({
        params: {
          protocolId: params.protocolId,
          page: pageParam as number,
        },
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
