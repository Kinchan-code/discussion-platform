import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useDeleteCommentReply } from '@/api/delete-comment-reply';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { Skeleton } from '@/components/ui/skeleton';
import useReplyStore from '@/store/reply-store';

import CommentCard from '@/features/profile/components/comment-card';
import { useGetUserCommentsInfinite } from '@/features/profile/pages/comments/api/user-comments';

/**
 * Comments Component
 * @description Displays user comments with options to navigate and delete.
 *
 * components used:
 * - CommentCard
 * - LoadMoreButton
 * - Skeleton
 *
 * @returns {JSX.Element} The Comments component.
 * @example
 * <Comments />
 */

function Comments() {
  const navigate = useNavigate();
  const { setHighlightComment } = useReplyStore();
  const handleNavigate = (threadId: string, commentId: string) => {
    navigate(`/threads/${threadId}`);
    setHighlightComment(commentId);
  };

  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteCommentReply();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserCommentsInfinite({ params: { perPage: 5 } });

  const comment = data?.pages.flatMap((page) => page.data) || [];

  const handleDelete = async (commentId: number) => {
    try {
      await toast.promise(deleteComment(commentId), {
        loading: 'Deleting comment...',
        success: 'Comment deleted successfully',
        error: 'Failed to delete comment',
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
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
          {comment.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              handleNavigate={() =>
                handleNavigate(
                  comment.thread.id.toString(),
                  comment.id.toString()
                )
              }
              isDeleting={isDeleting}
              onDelete={() => handleDelete(comment.id)}
            />
          ))}
          {comment.length === 0 ? (
            <p className='text-center text-xs md:text-sm text-muted-foreground italic'>
              No comments found. Engage in discussions by commenting on threads.
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

export default Comments;
