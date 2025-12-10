import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { useVoteReview } from "@/api/vote/vote-review";
import { useProtectedAction } from "@/hooks/use-protected-action";
import { VoteType } from "@/enums/vote-type-enums";

interface HelpfulVoteProps {
  voteCount?: number;
  reviewId: string;
  isLoading?: boolean;
  isUpvoted?: boolean;
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
 * @param {string} reviewId - The ID of the review being voted on.
 * @param {string} initialVoteStatus - The initial vote status ('helpful', 'not_helpful', or null).
 *
 * @returns {JSX.Element} The HelpfulVote component.
 * @example
 * <HelpfulVote voteCount={10} reviewId="123" initialVoteStatus="helpful" />
 */

function HelpfulVote({
  voteCount = 0,
  reviewId,
  isLoading,
  isUpvoted,
}: HelpfulVoteProps) {
  const { mutateAsync, isPending } = useVoteReview();
  const { executeProtectedAction } = useProtectedAction();

  const handleVote = async (voteType: VoteType) => {
    executeProtectedAction(async () => {
      await mutateAsync({ votableId: reviewId, voteType });
    });
  };

  return (
    <main className="flex items-center gap-2">
      <section className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleVote(VoteType.UPVOTE)}
          disabled={isLoading || isPending} // Disable button while vote is being computed
        >
          <Heart
            className={`size-3 md:size-4 transition-colors duration-200 cursor-pointer ${
              isUpvoted
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground hover:text-red-400"
            }`}
          />
        </Button>
      </section>
      {isLoading || isPending ? (
        <Loader2 className="size-3 md:size-4 animate-spin text-muted-foreground" />
      ) : (
        <section className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Helpful?</span>

          <span>({voteCount})</span>
        </section>
      )}
    </main>
  );
}

export default HelpfulVote;
