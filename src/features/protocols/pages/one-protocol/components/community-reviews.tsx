import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ReviewCard from '@/components/review-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReviewsInfinite } from '@/features/protocols/pages/one-protocol/api/reviews-by-protocol';
import { CommunityReviewsModal } from '@/features/protocols/pages/one-protocol/components/community-reviews-modal';
import CreateReview from '@/features/protocols/pages/one-protocol/components/create-review';
import { useReviewStore } from '@/store/review-store';

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
  const { highlightReview, setHighlightReview } = useReviewStore();
  const reviewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetReviewsInfinite({ params: { protocolId: protocolId || '' } });

  const reviews = data?.pages.flatMap((page) => page.data) || [];
  const total = reviews?.length || 0;

  // Scroll to highlighted review when highlightReview changes
  useEffect(() => {
    if (highlightReview && reviewRefs.current[highlightReview]) {
      setTimeout(() => {
        reviewRefs.current[highlightReview]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [highlightReview, reviews.length]); // Also depend on reviews.length to ensure reviews are loaded

  // Auto-clear highlight after 5 seconds
  useEffect(() => {
    if (highlightReview) {
      const timer = setTimeout(() => {
        setHighlightReview(null);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [highlightReview, setHighlightReview]);

  return (
    <main className='flex flex-col gap-4 h-full cursor-pointer'>
      <section id='write-review'>
        {isLoading ? (
          <div className='flex items-center flex-col gap-4 justify-center h-full'>
            <section className='h-[calc(100%-10%)] w-full flex flex-col gap-2'>
              <div className='h-3/4'>
                <Skeleton className='h-20 w-full rounded-xl' />
              </div>
              <div className='flex flex-col gap-2 h-1/4'>
                <Skeleton className='h-4 w-1/2 rounded-xl' />
                <Skeleton className='h-4 w-full rounded-xl' />
              </div>
            </section>
          </div>
        ) : (
          <Card>
            <CardHeader className='font-bold text-base md:text-xl'>
              Share your Experience
            </CardHeader>
            <CardContent>
              <CreateReview />
            </CardContent>
          </Card>
        )}
      </section>
      <section
        id='reviews-list'
        className='overflow-y-auto h-full'
      >
        {isLoading ? (
          <div className='flex items-center flex-col gap-4 justify-center h-full'>
            {Array.from({ length: 5 }).map((_, index) => (
              <section
                key={index}
                className='h-[calc(100%-10%)] w-full flex flex-col gap-2'
              >
                <div className='h-3/4'>
                  <Skeleton className='h-20 w-full rounded-xl' />
                </div>
                <div className='flex flex-col gap-2 h-1/4'>
                  <Skeleton className='h-4 w-1/2 rounded-xl' />
                  <Skeleton className='h-4 w-full rounded-xl' />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <p className='text-base md:text-xl'>Community Reviews</p>
                <p className='text-sm md:text-base'>({total})</p>
              </CardTitle>
            </CardHeader>
            {reviews?.length === 0 ? (
              <CardContent className='text-center'>
                <p className='text-xs text-muted-foreground'>
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            ) : (
              <CardContent className='flex flex-col gap-4 min-h-0 overflow-y-auto'>
                {reviews?.map((review) => (
                  <ReviewCard
                    key={review.id}
                    ref={(e) => {
                      if (e) {
                        reviewRefs.current[review.id.toString()] = e;
                      }
                    }}
                    review={review}
                    edit
                  />
                ))}
                <div className='flex justify-center'>
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
