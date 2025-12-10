import api from "@/api/axios-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ResponseError, Response } from "@/types/response";
import type { Reply } from "@/types/replies";

interface Params {
  id: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Params;
}

/**
 * Fetches replies for a specific comment or reply.
 *
 * @param {string} id - The ID of the comment or reply to fetch replies for.
 * @returns {Promise<Response<Reply[]>>} A promise that resolves to the replies data.
 * @throws {Error} If the API request fails or returns an error response.
 */

export const getReplies = async ({
  params,
}: QueryParams): Promise<Response<Reply[]>> => {
  try {
    const response = await api.get<Response<Reply[]>>(
      `/comments/${params.id}/replies`,
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
      throw new Error(`Replies fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch replies for a specific comment or reply using React Query.
 *
 * @param {string} id - The ID of the comment or reply to fetch replies for.
 * @returns {UseQueryResult<Response<Reply[]>, ResponseError>} The query result containing the replies data or error.
 * @example
 * const { data: replies, isLoading } = useGetReplies({ params: { id: '123' } });
 */

export const useGetReplies = ({ params }: QueryParams) => {
  return useQuery<Response<Reply[]>, ResponseError>({
    queryKey: ["replies", params.id, params.page, params.perPage],
    queryFn: () => getReplies({ params }),
    refetchOnWindowFocus: false,
    enabled: !!params.id, // Only run query if id exists
  });
};

export const useGetRepliesInfinite = ({ params }: QueryParams) => {
  return useInfiniteQuery<Response<Reply[]>, ResponseError>({
    queryKey: ["replies-infinite", params.id, params.page, params.perPage],
    queryFn: ({ pageParam = 1 }) =>
      getReplies({ params: { ...params, page: pageParam as number } }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.has_more_pages
        ? lastPage.pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
