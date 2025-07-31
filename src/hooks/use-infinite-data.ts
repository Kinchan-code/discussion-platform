import { useInfiniteQuery } from '@tanstack/react-query';

import type { Response } from '@/models/response';
import type { Pagination } from '@/models/pagination';

/**
 * Custom hook to fetch paginated data using React Query's infinite query.
 *
 * @template T - The type of data being fetched.
 * @param {UseInfiniteDataOptions<T>} options - Options for the infinite query.
 * @returns {Object} The query result, including data, loading state, and pagination methods.
 * @example
 * const { data, isLoading, loadMore, hasMore } = useInfiniteData({
 *   queryKey: ['items'],
 *   queryFn: fetchItems,
 * });
 */

interface InfiniteDataResponse<T> {
  data: T[];
  pagination: Pagination;
}

interface UseInfiniteDataOptions<T> {
  queryKey: string[];
  queryFn: (pageParam: number) => Promise<Response<InfiniteDataResponse<T>>>;
  enabled?: boolean;
}

export function useInfiniteData<T>({
  queryKey,
  queryFn,
  enabled = true,
}: UseInfiniteDataOptions<T>) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      return pagination.has_more_pages
        ? pagination.current_page + 1
        : undefined;
    },
    initialPageParam: 1,

    refetchOnWindowFocus: false,
    enabled,
  });

  // Flatten all pages data into a single array
  const allData = query.data?.pages.flatMap((page) => page.data.data) ?? [];

  return {
    ...query,
    data: allData,
    loadMore: query.fetchNextPage,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}
