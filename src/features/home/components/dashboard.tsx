import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeaturedProtocols } from "@/api/protocols/featured-protocols";
import { useGetTrending } from "@/api/home/trending";
import { Analytics } from "@/features/home/components/analytics";
import { Banner } from "@/features/home/components/banner";
import { DashboardFilters } from "@/features/home/components/dashboard-filters";
import { ProtocolCard } from "@/features/home/components/protocol-card";
import { SkeletonCard } from "@/features/home/components/skeleton-card";
import { TrendingDiscussionsCard } from "@/features/home/components/trending-discussions-card";

/**
 * Dashboard Component
 *
 * @description Displays the main dashboard with banners, analytics, filters, featured protocols, and trending discussions.
 *
 * components used:
 * - Banner: Displays promotional banners.
 * - Analytics: Displays various statistics about the platform.
 * - DashboardFilters: Provides search and trending tags.
 * - ProtocolCard: Displays featured protocols.
 * - TrendingDiscussionsCard: Displays trending discussions.
 * - SkeletonCard: Displays a skeleton placeholder for loading states.
 *
 * @returns {JSX.Element} The Dashboard component.
 * @example
 * <Dashboard />
 */

function Dashboard() {
  const { data: trending, isFetching: isTrendingLoading } = useGetTrending();
  const { data: featuredProtocols, isLoading: isFeaturedProtocolsLoading } =
    useGetFeaturedProtocols();

  return (
    <main className="flex flex-col gap-8">
      <section id="banners">
        <Banner />
      </section>
      <section id="statistics">
        <Analytics />
      </section>
      <section id="filters">
        <DashboardFilters />
      </section>
      <section id="protocols" className="flex flex-col gap-4">
        <h2 className="text-base md:text-lg lg:text-xl font-bold">
          Featured Protocols
        </h2>
        <div className="w-full flex flex-col h-full md:flex-row gap-4">
          <div className="w-full md:w-6/8">
            {isFeaturedProtocolsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                {Array.from({ length: 6 }).map((_, index) => (
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                <ProtocolCard
                  protocol={featuredProtocols?.data || []}
                  height="full"
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-2/8 min-h-60">
            {isTrendingLoading ? (
              <div className="grid grid-cols-1 gap-4 w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <TrendingDiscussionsCard threads={trending?.data || []} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
