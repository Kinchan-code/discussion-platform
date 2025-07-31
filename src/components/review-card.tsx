import HelpfulVote from '@/features/protocols/pages/one-protocol/components/helpful-vote';
import { cn } from '@/lib/utils';
import type { Reviews } from '@/models/reviews';
import { useAuthStore } from '@/store/auth-store';
import { useReviewStore } from '@/store/review-store';
import { Calendar, Star, User } from 'lucide-react';
import DeleteButton from './delete-button';
import { useDeleteReview } from '@/api/delete-review';
import { toast } from 'sonner';
import EditReview from '@/features/protocols/pages/one-protocol/components/edit-review';

/**
 * ReviewCard Component
 *
 * Displays a review with details like rating, author, date, and feedback.
 * Allows authenticated users to vote on the review's helpfulness.
 *
 * components used:
 * - HelpfulVote: For voting on the review's helpfulness.
 * - DeleteButton: For deleting the review if the user is the author.
 * - EditReview: For editing the review if the user is the author.
 *
 * @param {Reviews} review - The review data to display.
 * @param {function} handleNavigateToReview - Optional function to handle navigation when the card is clicked.
 * @param {React.Ref<HTMLDivElement>} ref - Optional ref for the card element.
 * @param {boolean} edit - Whether to show edit options for the review.
 *
 * @returns ReviewCard component
 * @example
 * <ReviewCard
 *  review={review}
 * />
 */

interface ReviewCardProps {
  review: Reviews;
  handleNavigateToReview?: () => void;
  onClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  edit?: boolean;
}

function ReviewCard({
  review,
  handleNavigateToReview,
  ref,
  edit,
}: ReviewCardProps) {
  const { user } = useAuthStore();
  const { highlightReview, setSelectedReview, setOpenEdit } = useReviewStore();
  const { mutateAsync, isPending } = useDeleteReview();

  const isHighlighted = highlightReview === review.id.toString();

  const handleMainClick = () => {
    // If there's a navigation handler, use it
    if (handleNavigateToReview) {
      handleNavigateToReview();
    }
    // Highlights will auto-clear after 5 seconds via timer
  };

  const handleEdit = () => {
    setSelectedReview(review);
    setOpenEdit(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, reviewId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toast.promise(mutateAsync(reviewId), {
        loading: 'Deleting review...',
        success: 'Review deleted successfully',
        error: 'Failed to delete review',
      });
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <main
      ref={ref}
      className={cn(
        'border rounded-xl p-4 border-gray-200 flex flex-col gap-4 cursor-pointer',
        !handleNavigateToReview
          ? isHighlighted
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-white'
          : ''
      )}
      onClick={handleMainClick}
    >
      <section className='flex flex-col justify-between gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn('size-3 md:size-4', {
                    'fill-yellow-400 text-yellow-400': star <= review.rating,
                    'text-gray-300': star > review.rating,
                  })}
                />
              ))}
            </div>
            <span className='text-xs md:text-sm text-muted-foreground'>
              {review.rating}/5 stars
            </span>
          </div>

          {review.author === user?.name && (
            <div className='flex items-center gap-2'>
              {edit && <EditReview setOpen={handleEdit} />}
              <DeleteButton
                loading={isPending}
                onDelete={(e) => handleDeleteClick(e, review.id)}
              />
            </div>
          )}
        </div>
        <div className='flex md:items-center flex-col md:flex-row gap-2 text-xs text-gray-600'>
          <div className='flex items-center gap-1'>
            <User className='w-3 h-3' />
            <span>{review.author}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' />
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {review.feedback ? (
        <p className='text-xs md:text-sm text-gray-700'>{review.feedback}</p>
      ) : (
        <p className='text-xs italic text-muted-foreground'>
          No feedback provided.
        </p>
      )}
      {review.author !== user?.name && (
        <HelpfulVote
          reviewId={review.id}
          voteCount={review.helpful_count}
        />
      )}
    </main>
  );
}

export default ReviewCard;
