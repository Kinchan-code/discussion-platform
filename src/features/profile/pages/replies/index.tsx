import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useDeleteCommentReply } from '@/api/delete-comment-reply';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { Skeleton } from '@/components/ui/skeleton';
import useReplyStore from '@/store/reply-store';

import CommentCard from '@/features/profile/components/comment-card';
import { useGetUserRepliesInfinite } from '@/features/profile/pages/replies/api/user-replies';

/**
 * Replies Component
 * @description Displays user replies with pagination and delete functionality.
 *
 * components used:
 * - CommentCard
 * - LoadMoreButton
 * - Skeleton
 *
 * @returns {JSX.Element} The Replies component.
 */

function Replies() {
  const navigate = useNavigate();
  const { setHighlightReply } = useReplyStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserRepliesInfinite({ params: { perPage: 5 } });

  const { mutateAsync: deleteReply, isPending: isDeletePending } =
    useDeleteCommentReply();

  const replies = data?.pages.flatMap((page) => page.data) || [];

  const handleDelete = async (replyId: number) => {
    try {
      await toast.promise(deleteReply(replyId), {
        loading: 'Deleting reply...',
        success: 'Reply deleted successfully!',
        error: 'Failed to delete reply.',
      });
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleNavigate = (threadId: string, replyId: string) => {
    navigate(`/threads/${threadId}`);
    setHighlightReply(replyId);
  };

  return (
    <main className='flex flex-col gap-4'>
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
          {' '}
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              handleNavigate={() =>
                handleNavigate(reply.thread.id.toString(), reply.id.toString())
              }
              onDelete={() => handleDelete(reply.id)}
              isDeleting={isDeletePending && reply.id === reply.id}
            />
          ))}
          {replies.length === 0 ? (
            <p className='text-center text-xs md:text-sm text-muted-foreground italic'>
              No replies found. Engage in discussions by replying to comments.
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

export default Replies;
