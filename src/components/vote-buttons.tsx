import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

/**
 * VoteButtons Component
 *
 * @description A component that displays upvote and downvote buttons with the current vote score.
 * It allows users to vote on content and shows the current vote count.
 *
 * components used:
 * - Button: For the upvote and downvote buttons.
 * - Loader2: For the loading spinner while the vote is being processed.
 * - ThumbsUp: Icon for the upvote button.
 * - ThumbsDown: Icon for the downvote button.
 *
 * @param {number} vote_score - The current score of the votes.
 * @param {function} handleUpVote - Function to handle upvote action.
 * @param {function} handleDownVote - Function to handle downvote action.
 * @param {boolean} upVoted - Optional boolean indicating if the user has already upvoted.
 * @param {boolean} downVoted - Optional boolean indicating if the user has already downvoted.
 * @param {string} align - Optional alignment for the buttons (default: 'right').
 * @param {string} direction - Optional direction for button layout (default: 'vertical').
 * @param {boolean} isComputing - Optional prop to indicate if the button is in a loading state.
 * @param {string} align - Alignment of the buttons ('left', 'center', 'right').
 *
 * @returns The VoteButtons component.
 * @example
 * <VoteButtons
 *   vote_score={10}
 *   handleUpVote={() => console.log('Upvoted')}
 *   handleDownVote={() => console.log('Downvoted')}
 *   upVoted={false}
 *   downVoted={false}
 *   align='left'
 *   direction='horizontal'
 *   isComputing={false}
 * />
 */

interface VoteButtonsProps {
  vote_score: number;
  handleUpVote: () => void;
  handleDownVote: () => void;
  upVoted?: boolean;
  downVoted?: boolean;
  align?: 'left' | 'center' | 'right';
  direction?: 'horizontal' | 'vertical';
  isComputing?: boolean; // Optional prop to indicate if the button is in a loading state
}

function VoteButtons({
  vote_score,
  handleUpVote,
  handleDownVote,
  align = 'right',
  upVoted = false,
  downVoted = false,
  direction = 'vertical',
  isComputing = false, // Default to false if not provided
}: VoteButtonsProps) {
  return (
    <section
      className={cn(
        'flex items-center md:gap-2 w-full md:w-auto',
        {
          'justify-start': align === 'left',
          'justify-center': align === 'center',
          'justify-end': align === 'right',
        },
        direction === 'vertical' ? 'flex-row md:flex-col' : 'flex-row'
      )}
    >
      <Button
        variant='ghost'
        size='icon'
        onClick={handleUpVote}
        disabled={isComputing} // Disable button while vote is being computed
      >
        {upVoted ? (
          <ThumbsUp className='size-3 md:size-4 fill-black' />
        ) : (
          <ThumbsUp className='size-3 md:size-4' />
        )}
      </Button>
      {isComputing ? (
        <div className='text-xs md:text-sm font-medium text-muted-foreground'>
          <Loader2 className='animate-spin size-3 md:size-4' />
        </div>
      ) : (
        <p className='text-xs md:text-sm font-medium text-center'>
          {vote_score}
        </p>
      )}

      <Button
        variant='ghost'
        size='icon'
        onClick={handleDownVote}
        disabled={isComputing} // Disable button while vote is being computed
      >
        {downVoted ? (
          <ThumbsDown className='size-3 md:size-4 fill-black' />
        ) : (
          <ThumbsDown className='size-3 md:size-4' />
        )}
      </Button>
    </section>
  );
}

export { VoteButtons };
