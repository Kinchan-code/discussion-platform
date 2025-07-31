import { Heart, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button/button';
import { useVoteReview } from '@/features/protocols/pages/one-protocol/api/vote-review';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { useVoteReviewStore } from '@/store/vote-review-store';

interface HelpfulVoteProps {
  voteCount?: number;
  reviewId: number;
  initialVoteStatus?: 'helpful' | 'not_helpful' | null;
}

/**
 * HelpfulVote Component
 * @description Displays a button to vote on the helpfulness of a review.
 *
 * components used:
 * - Button
 * - Heart (icon)
 * - Loader2 (icon)
 *
 * @param {number} voteCount - The number of votes the review has received.
 * @param {number} reviewId - The ID of the review being voted on.
 * @param {string} initialVoteStatus - The initial vote status ('helpful', 'not_helpful', or null).
 *
 * @returns {JSX.Element} The HelpfulVote component.
 * @example
 * <HelpfulVote voteCount={10} reviewId={123} initialVoteStatus="helpful" />
 */

function HelpfulVote({
  voteCount = 0,
  reviewId,
  initialVoteStatus = null,
}: HelpfulVoteProps) {
  const { mutateAsync, isPending } = useVoteReview(reviewId);
  const { hasUpvoted, setVote, getVote } = useVoteReviewStore();
  const { executeProtectedAction } = useProtectedAction();

  // Initialize vote status from props only if not already set in store
  useEffect(() => {
    const currentVote = getVote(reviewId);
    if (currentVote === null && initialVoteStatus !== null) {
      setVote(reviewId, initialVoteStatus);
    }
  }, [initialVoteStatus, reviewId, setVote, getVote]);

  const isUpvoted = hasUpvoted(reviewId);

  const handleVote = async (vote: 'upvote' | 'downvote') => {
    executeProtectedAction(async () => {
      await mutateAsync({ vote });
    });
  };

  return (
    <main className='flex items-center gap-2'>
      <section className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleVote('upvote')}
          disabled={isPending} // Disable button while vote is being computed
        >
          <Heart
            className={`size-3 md:size-4 transition-colors duration-200 cursor-pointer ${
              isUpvoted
                ? 'fill-red-500 text-red-500'
                : 'text-muted-foreground hover:text-red-400'
            }`}
          />
        </Button>
      </section>
      {isPending ? (
        <Loader2 className='size-3 md:size-4 animate-spin text-muted-foreground' />
      ) : (
        <section className='flex items-center gap-1 text-xs text-muted-foreground'>
          <span>Helpful?</span>

          <span>({voteCount})</span>
        </section>
      )}
    </main>
  );
}

export default HelpfulVote;
