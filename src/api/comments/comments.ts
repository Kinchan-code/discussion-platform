import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { ResponseError, Response } from "@/types/response";
import type { Comments } from "@/types/comments";

/**
 * Fetches comments for a specific thread.
 *
 * @description This function retrieves comments associated with a specific thread ID.
 *
 * @param {Query} params - The parameters for fetching comments.
 * @param {string} params.threadId - The ID of the thread to fetch comments for.
 * @param {string} [params.author] - Optional author filter for comments.
 * @param {number} [params.page=1] - The page number for pagination.
 * @param {number} [params.perPage=5] - The number of comments per page.
 *
 * @return {Promise<Response<Comments[]>>} A promise that resolves to the comments data.
 * @throws {Error} If the API request fails or returns an error response.
 */

interface Params {
  threadId: string;
  author?: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

export const getComments = async ({
  params,
}: QueryParams): Promise<Response<Comments[]>> => {
  try {
    const response = await api.get<Response<Comments[]>>(
      `/threads/${params.threadId}/comments`,
      {
        params: {
          author: params.author,
          per_page: 5,
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
      throw new Error(`Comments fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch comments for a specific thread using React Query.
 *
 * @param {QueryParams} params - The parameters for fetching comments.
 * @returns {UseQueryResult<Response<Comments[]>, ResponseError>} The query result containing the comments data or error.
 * @example
 * const { data: comments, isLoading } = useGetComments({ params: { threadId: '123' } });
 */

export const useGetComments = ({ params }: QueryParams) => {
  return useQuery<Response<Comments[]>, ResponseError>({
    queryKey: ["comments", params.threadId, params.author],
    queryFn: () => getComments({ params }),
    refetchOnWindowFocus: false,
    enabled: !!params.threadId, // Only run query if threadId exists
  });
};

export const useGetCommentsInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Comments[]>, ResponseError>({
    queryKey: ["comments-infinite", params.threadId, params.author],
    queryFn: ({ pageParam = 1 }) =>
      getComments({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
