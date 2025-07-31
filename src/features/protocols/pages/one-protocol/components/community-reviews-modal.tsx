import { Calendar, Star, User } from 'lucide-react';

import { Button } from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import HelpfulVote from '@/features/protocols/pages/one-protocol/components/helpful-vote';

import type { Reviews } from '@/models/reviews';

/**
 * Community Reviews Modal Component
 * @description Displays community reviews in a modal with pagination support.
 *
 * components used:
 * - Dialog
 * - DialogTrigger
 * - DialogContent
 * - DialogHeader
 * - DialogTitle
 * - DialogDescription
 * - LoadMoreButton
 * - HelpfulVote
 *
 * @param {Object} props - The properties for the CommunityReviewsModal component.
 * @param {Reviews[]} props.infiniteReviews - The list of reviews to display.
 * @param {function} props.fetchNextPage - Function to fetch the next page of reviews.
 * @param {boolean} props.isLoading - Whether the reviews are currently being loaded.
 * @param {boolean} props.hasNextPage - Whether there are more pages of reviews to load.
 * @param {boolean} props.isFetchingNextPage - Whether the next page is currently being fetched.
 *
 * @returns {JSX.Element} The CommunityReviewsModal component.
 * @example
 * <CommunityReviewsModal
 *   infiniteReviews={[]}
 *   fetchNextPage={() => {}}
 *   isLoading={false}
 *   hasNextPage={false}
 *   isFetchingNextPage={false}
 * />
 */

interface CommunityReviewsModalProps {
  infiniteReviews: Reviews[];
  fetchNextPage: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

function CommunityReviewsModal({
  infiniteReviews,
  fetchNextPage,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
}: CommunityReviewsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='w-full text-xs md:text-sm text-muted-foreground'
        >
          See All Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Reviews</DialogTitle>
          <DialogDescription>
            View reviews from the community about{' '}
            {localStorage.getItem('protocol')}.
          </DialogDescription>
        </DialogHeader>
        <main className='flex flex-col gap-4 h-96 p-2 overflow-y-auto cursor-pointer'>
          {infiniteReviews?.map((review) => (
            <section
              key={review?.id}
              className='border rounded-xl p-4 border-gray-200 flex flex-col gap-4'
            >
              <div className='flex flex-col justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <span className='text-xs md:text-sm text-muted-foreground'>
                      {review.rating}/5 stars
                    </span>
                  </div>
                </div>
                <div className='flex md:items-center flex-col md:flex-row gap-2 text-xs text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <User className='w-3 h-3' />
                    <span>{review.author}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    <span>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {review.feedback ? (
                <p className='text-sm text-gray-700'>{review.feedback}</p>
              ) : (
                <p className='text-xs italic text-muted-foreground'>
                  No feedback provided.
                </p>
              )}

              {/* <div className='flex items-center gap-1 text-muted-foreground text-xs cursor-pointer'> */}
              <HelpfulVote
                reviewId={review.id}
                voteCount={review.helpful_count}
              />
              {/* </div> */}
            </section>
          ))}
        </main>
        <DialogFooter>
          <div className='flex justify-center w-full'>
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CommunityReviewsModal };
