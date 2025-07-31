import { useNavigate } from 'react-router-dom';

import ReviewCard from '@/components/review-card';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviewStore } from '@/store/review-store';

import { useGetUserReviewsInfinite } from '@/features/profile/pages/reviews/api/user-reviews';

/**
 * Reviews Component
 * @description Displays user reviews with pagination and loading state.
 *
 * components used:
 * - ReviewCard
 * - LoadMoreButton
 * - Skeleton
 *
 * @param {Object} props - The properties for the Reviews component.
 * @param {function} props.handleNavigateToReview - Function to navigate to a specific review.
 * @param {boolean} props.isLoading - Indicates if the reviews are currently loading.
 * @param {boolean} props.hasNextPage - Indicates if there are more reviews to load.
 * @param {boolean} props.isFetchingNextPage - Indicates if the next page of reviews is being fetched.
 * @param {function} props.fetchNextPage - Function to fetch the next page of reviews.
 * @param {Array} props.userReviews - The list of user reviews to display.
 * @param {function} props.setHighlightReview - Function to set the review to highlight.
 *
 * @returns {JSX.Element} The Reviews component.
 *
 * @example
 * <Reviews />
 */

function Reviews() {
  const navigate = useNavigate();
  const { setHighlightReview } = useReviewStore();
  const {
    data: userReviews,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetUserReviewsInfinite({
    params: {
      perPage: 5,
    },
  });

  const reviews = userReviews?.pages.flatMap((page) => page.data) || [];

  const handleNavigate = (protocolId: string, reviewId: string) => {
    navigate(`/protocols/${protocolId}`);
    setHighlightReview(reviewId);
  };

  return (
    <main>
      {isLoading ? (
        <div className='flex flex-col space-y-3 w-full'>
          <Skeleton className='h-36 w-full rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </div>
      ) : (
        <section className='flex flex-col gap-4'>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              handleNavigateToReview={() =>
                handleNavigate(
                  review.protocol_id.toString(),
                  review.id.toString()
                )
              }
            />
          ))}
          {reviews.length === 0 ? (
            <p className='text-center text-xs md:text-sm text-muted-foreground italic'>
              No reviews found. Share your feedback on protocols you have used.
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

export default Reviews;
