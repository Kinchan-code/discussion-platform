import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2, MessageSquare } from "lucide-react";
import GoBackButton from "@/components/go-back-button";
import { slugify } from "@/lib/utils";
import { CommentItem } from "@/components/comments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button/button";
import { useGetOneComment } from "@/api/comments/one-comment";
import useReplyStore from "@/store/reply-store";

/**
 * OneComment Component
 *
 * @description Displays a single comment with its replies and a link to navigate to the thread.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - CommentItem: Displays the comment with voting, editing, and reply functionality.
 * - Card: Container for the comment display.
 * - Button: Link button to navigate to the thread.
 *
 * @returns {JSX.Element} The OneComment component.
 * @example
 * <OneComment />
 */

function OneComment() {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const { setShowRepliesComment, isShowRepliesCommentActive } = useReplyStore();

  const {
    data: commentData,
    isLoading: isLoadingComment,
    isError: isCommentError,
    error: commentError,
  } = useGetOneComment(commentId || "");

  const comment = commentData?.data;

  // Automatically show replies when comment is loaded
  useEffect(() => {
    if (comment && commentId && !isShowRepliesCommentActive(commentId)) {
      setShowRepliesComment(commentId);
    }
  }, [comment, commentId, setShowRepliesComment, isShowRepliesCommentActive]);

  if (isLoadingComment) {
    return (
      <main className="flex flex-col gap-4 h-full">
        <section>
          <GoBackButton />
        </section>
        <section>
          <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-36 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isCommentError || !comment) {
    return (
      <main className="flex flex-col gap-4 h-full">
        <section>
          <GoBackButton />
        </section>
        <section>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                <MessageSquare className="size-8 md:size-10" />
                <p className="text-xs md:text-sm">
                  {commentError instanceof Error
                    ? commentError.message
                    : "Failed to load comment. Please try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4 h-full">
      <section>
        <GoBackButton />
      </section>
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-3 md:size-4" />
                <p className="text-base md:text-lg">Comment</p>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    `/threads/${comment.thread_id}/${slugify(
                      comment.thread?.title || ""
                    )}`
                  )
                }
                className="text-xs md:text-sm"
              >
                <Link2 className="size-3 md:size-4 mr-1" />
                View Thread
              </Button>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Discussion: {comment.thread?.title || "No title available"}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CommentItem
              comment={comment}
              commentId={comment.id.toString()}
              isLoading={isLoadingComment}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default OneComment;
