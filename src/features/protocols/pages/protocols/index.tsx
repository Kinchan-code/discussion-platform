import { useSearchParams } from "react-router-dom";

import GoBackButton from "@/components/go-back-button";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "@/features/home/components/filters";
import { ProtocolCard } from "@/features/home/components/protocol-card";
import { useGetProtocolsInfinite } from "@/api/protocols/protocols";
import { Header } from "@/features/protocols/pages/protocols/components/header";

import type { Protocols } from "@/types/protocols";

/**
 * AllProtocols Component
 *
 * @description This component displays a list of all protocols with infinite scrolling.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - Filters: Provides filtering options for protocols.
 * - ProtocolCard: Displays individual protocol cards.
 * - LoadMoreButton: A button to load more protocols when clicked.
 *
 * @returns {JSX.Element} The AllProtocols component.
 *
 * @example
 * <AllProtocols />
 */

function AllProtocols() {
  const [params] = useSearchParams();
  const {
    data: protocols,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetProtocolsInfinite({
    params: {
      sort: params.get("sort") || "recent",
      tags: params.get("tags") || "",
    },
  });

  return (
    <main className="flex flex-col gap-8 max-w-7xl mx-auto">
      <section>
        <GoBackButton />
      </section>
      <Header />
      <Filters contentType="protocols" />
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProtocolCard
              protocol={
                protocols?.pages.flatMap((page) => page.data as Protocols[]) ||
                []
              }
              height="full"
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

export default AllProtocols;
