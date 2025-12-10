import { toast } from "sonner";

import { useDeleteProtocol } from "@/api/protocols/delete-protocol";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtocolCard } from "@/features/home/components/protocol-card";
import { useGetProtocolsInfinite } from "@/api/protocols/protocols";
import { useAuthStore } from "@/store/auth-store";

import type { Protocols } from "@/types/protocols";

/**
 * Protocols Component
 * @description Displays a list of protocols with options to delete and load more.
 *
 * components used:
 * - ProtocolCard
 * - LoadMoreButton
 * - Skeleton
 *
 * @returns {JSX.Element} The Protocols component.
 * @example
 * <Protocols />
 */

function Protocols() {
  const { user } = useAuthStore();

  const { mutateAsync: deleteProtocol, isPending } = useDeleteProtocol();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetProtocolsInfinite({
      params: {
        sort: "recent",
        tags: "",
        author: user?.name || "current_user",
        perPage: 5,
      },
    });

  const protocols =
    data?.pages.flatMap((page) => page.data as Protocols[]) || [];

  const handleDelete = async (protocolId: string) => {
    try {
      await toast.promise(deleteProtocol(protocolId), {
        loading: "Deleting protocol...",
        success: "Protocol deleted successfully!",
        error: "Error deleting protocol",
      });
    } catch (error) {
      console.error("Error deleting protocol:", error);
    }
  };

  return (
    <main>
      {isLoading ? (
        <div className="flex flex-col space-y-3 w-full">
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ) : (
        <section className="flex flex-col gap-4">
          <ProtocolCard
            protocol={protocols}
            height="full"
            actions={true}
            onDelete={(protocolId) => handleDelete(protocolId)}
            isDeleting={isPending}
          />
          {protocols.length === 0 ? (
            <p className="text-xs md:text-sm text-center italic text-muted-foreground">
              No protocols found. Create one to contribute.
            </p>
          ) : (
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </section>
      )}
    </main>
  );
}

export default Protocols;
