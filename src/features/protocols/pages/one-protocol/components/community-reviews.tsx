import { useParams } from "react-router-dom";

import ReviewCard from "@/components/review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReviewsInfinite } from "@/api/reviews/reviews-by-protocol";
import { CommunityReviewsModal } from "@/features/protocols/pages/one-protocol/components/community-reviews-modal";
import CreateReview from "@/features/protocols/pages/one-protocol/components/create-review";

/**
 * CommunityReviews Component
 * @description Displays community reviews for a specific protocol.
 *
 * components used:
 * - ReviewCard
 * - CreateReview
 * - CommunityReviewsModal
 *
 * @returns {JSX.Element} The CommunityReviews component.
 * @example
 * <CommunityReviews />
 */

function CommunityReviews() {
  const { protocolId } = useParams();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetReviewsInfinite({ params: { protocolId: protocolId || "" } });

  const reviews = data?.pages.flatMap((page) => page.data) || [];
  const total = reviews?.length || 0;

  return (
    <main className="flex flex-col gap-4 h-full cursor-pointer">
      <section id="write-review">
        {isLoading ? (
          <div className="flex items-center flex-col gap-4 justify-center h-full">
            <section className="h-[calc(100%-10%)] w-full flex flex-col gap-2">
              <div className="h-3/4">
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
              <div className="flex flex-col gap-2 h-1/4">
                <Skeleton className="h-4 w-1/2 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-xl" />
              </div>
            </section>
          </div>
        ) : (
          <Card>
            <CardHeader className="font-bold text-base md:text-xl">
              Share your Experience
            </CardHeader>
            <CardContent>
              <CreateReview />
            </CardContent>
          </Card>
        )}
      </section>
      <section id="reviews-list" className="overflow-y-auto h-full">
        {isLoading ? (
          <div className="flex items-center flex-col gap-4 justify-center h-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <section
                key={index}
                className="h-[calc(100%-10%)] w-full flex flex-col gap-2"
              >
                <div className="h-3/4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-2 h-1/4">
                  <Skeleton className="h-4 w-1/2 rounded-xl" />
                  <Skeleton className="h-4 w-full rounded-xl" />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <p className="text-base md:text-xl">Community Reviews</p>
                <p className="text-sm md:text-base">({total})</p>
              </CardTitle>
            </CardHeader>
            {reviews?.length === 0 ? (
              <CardContent className="text-center">
                <p className="text-xs text-muted-foreground">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            ) : (
              <CardContent className="flex flex-col gap-4 min-h-0 overflow-y-auto">
                {reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} edit />
                ))}
                <div className="flex justify-center">
                  <CommunityReviewsModal
                    infiniteReviews={reviews}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </section>
    </main>
  );
}

export default CommunityReviews;
