import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { Response, ResponseError } from "@/types/response";
import type { Reviews } from "@/types/reviews";

/**
 * Fetches user reviews from the server.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {Promise<Response<Reviews[]>>} A promise that resolves to the user reviews data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const userReviews = await getUserReviews({ params: { page: 1, perPage: 10 } });
 */

interface Params {
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

export const getUserReviews = async ({
  params,
}: QueryParams): Promise<Response<Reviews[]>> => {
  try {
    const response = await api.get<Response<Reviews[]>>("/profile/reviews", {
      params: {
        per_page: params.perPage || 12,
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
      throw new Error(`Reviews fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch user reviews using React Query.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseQueryResult<Response<Reviews[]>, ResponseError>} The query result containing user reviews data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetUserReviews({ params: { page: 1, perPage: 10 } });
 */

export const useGetUserReviews = ({ params }: QueryParams) => {
  return useQuery<Response<Reviews[]>, ResponseError>({
    queryKey: ["user-reviews", params.page, params.perPage],
    queryFn: () => getUserReviews({ params }),
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook to fetch user reviews with infinite scrolling using React Query.
 *
 * @param {QueryParams} params - The parameters for pagination.
 * @returns {UseInfiniteQueryResult<Response<Reviews[]>, ResponseError>} The query result containing user reviews data or error.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetUserReviewsInfinite({ params: { page: 1, perPage: 10 } });
 */

export const useGetUserReviewsInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Reviews[]>, ResponseError>({
    queryKey: ["user-reviews-infinite", params.page, params.perPage],
    queryFn: ({ pageParam = 1 }) =>
      getUserReviews({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
