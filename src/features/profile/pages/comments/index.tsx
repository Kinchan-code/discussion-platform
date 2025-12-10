import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useDeleteComment } from "@/api/comments/delete-comment";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";

import CommentCard from "@/features/profile/components/comment-card";
import { useGetUserCommentsInfinite } from "@/api/profile/user-comments";

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
  const handleNavigateToComment = (commentId: string) => {
    navigate(`/comments/${commentId}`);
  };

  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteComment();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserCommentsInfinite({ params: { perPage: 5 } });

  const comment = data?.pages.flatMap((page) => page.data) || [];

  const handleDelete = async (commentId: string) => {
    try {
      await toast.promise(deleteComment(commentId), {
        loading: "Deleting comment...",
        success: "Comment deleted successfully",
        error: "Failed to delete comment",
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <main className="flex flex-col gap-4">
      {isLoading ? (
        <div className="flex flex-col space-y-3 w-full">
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ) : (
        <section className="flex flex-col gap-4">
          {comment.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              handleNavigate={() =>
                handleNavigateToComment(comment.id.toString())
              }
              isDeleting={isDeleting}
              onDelete={() => handleDelete(comment.id.toString())}
            />
          ))}
          {comment.length === 0 ? (
            <p className="text-center text-xs md:text-sm text-muted-foreground italic">
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
