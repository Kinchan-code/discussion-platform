import { Calendar, MessageSquare, Reply } from 'lucide-react';

import DeleteButton from '@/components/delete-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge/badge';
import { useAuthStore } from '@/store/auth-store';

import type { UserComments } from '@/models/profile';

/**
 * CommentCard Component
 * @description Displays a comment card with details and actions.
 *
 * components used:
 * - Alert
 * - AlertTitle
 * - AlertDescription
 * - Badge
 * - DeleteButton
 *
 * @param {Object} props - The properties for the CommentCard component.
 * @param {UserComments} props.comment - The comment data to display.
 * @param {function} props.handleNavigate - Function to navigate to the discussion thread.
 * @param {function} [props.onDelete] - Function to call when delete is clicked.
 * @param {boolean} [props.isDeleting=false] - Whether the delete action is in progress.
 *
 * @returns {JSX.Element} The CommentCard component.
 */

interface Comment {
  comment: UserComments;
  handleNavigate: () => void;
  onDelete?: (commentId: number) => void;
  isDeleting?: boolean;
}

function CommentCard({
  comment,
  handleNavigate,
  onDelete,
  isDeleting,
}: Comment) {
  const { user } = useAuthStore();

  return (
    <section
      key={comment.id}
      className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col gap-2 md:gap-4'
    >
      {comment.reply_context && (
        <div className='flex items-center justify-between gap-2'>
          <Badge
            variant='secondary'
            className=' text-xs md:text-sm text-muted-foreground rounded-md'
          >
            <Reply className='size-3 md:size-4' />
            Reply to {comment.reply_context.replying_to_author}
          </Badge>
          {user?.name === comment.author && comment.reply_context && (
            <DeleteButton
              loading={isDeleting}
              onDelete={() => onDelete?.(comment.id)}
            />
          )}
        </div>
      )}

      <div className='flex items-center gap-2 justify-between'>
        <p className='text-muted-foreground text-xs md:text-sm leading-relaxed break-words'>
          {comment.body}
        </p>
        {user?.name === comment.author && !comment.reply_context && (
          <DeleteButton
            loading={isDeleting}
            onDelete={() => onDelete?.(comment.id)}
          />
        )}
      </div>

      {/* Thread Context */}
      <Alert
        className='bg-gray-50 rounded border-l-4 border-blue-200'
        onClick={handleNavigate}
      >
        <AlertTitle>
          <p className='text-xs md:text-sm text-muted-foreground'>
            Comment on discussion:
          </p>
        </AlertTitle>
        <AlertDescription>
          <p className='hover:text-blue-600 font-medium text-xs md:text-sm'>
            {comment.thread.title}
          </p>
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className='flex items-center justify-between text-sm text-gray-600'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <MessageSquare className='size-3 md:size-4' />
            <span className='text-xs md:text-sm text-muted-foreground'>
              Score: {comment.vote_score}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Calendar className='size-3 md:size-4' />
          <span className='text-xs md:text-sm text-muted-foreground'>
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </section>
  );
}

export default CommentCard;
