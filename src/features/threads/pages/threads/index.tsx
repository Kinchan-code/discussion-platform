import { useSearchParams } from "react-router-dom";

import GoBackButton from "@/components/go-back-button";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "@/features/home/components/filters";
import { useGetThreadsInfinite } from "@/api/threads/threads";
import { Header } from "@/features/threads/components/header";
import ThreadsCard from "@/features/threads/components/threads-card";

import type { Threads } from "@/types/threads";

/**
 * AllThreads Component
 * @description Displays a list of threads with filters and pagination.
 *
 * components used:
 * - GoBackButton
 * - LoadMoreButton
 * - Skeleton
 * - Filters
 * - Header
 * - ThreadsCard
 *
 * @returns {JSX.Element} The AllThreads component.
 * @example
 * <AllThreads />
 */

function AllThreads() {
  const [params] = useSearchParams();
  const {
    data: threads,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetThreadsInfinite({
    params: {
      sort: params.get("sort") || "recent",
      protocol_id: params.get("protocol")
        ? params.get("protocol") || null
        : null,
    },
  });

  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <section>
        <GoBackButton />
      </section>
      <Header />
      <Filters contentType="discussions" />
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 ">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="flex flex-col space-y-3 w-full" key={index}>
              <Skeleton className="h-36 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            <ThreadsCard
              thread={
                threads?.pages.flatMap((page) => page.data as Threads[]) || []
              }
            />
          </div>
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </main>
  );
}

export default AllThreads;
