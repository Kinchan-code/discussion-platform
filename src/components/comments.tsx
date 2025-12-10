import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Loader,
  MessageSquare,
  Reply as ReplyIcon,
  User,
} from "lucide-react";
import DeleteButton from "@/components/delete-button";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormTextArea } from "@/components/ui/form-textarea";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { VoteButtons } from "@/components/vote-buttons";
import { ReplyItem } from "@/components/replies";
import { useAuthStore } from "@/store/auth-store";
import useReplyStore from "@/store/reply-store";
import { useThreadStore } from "@/store/thread-store";
import { useDeleteComment } from "@/api/comments/delete-comment";
import { useCreateComment } from "@/api/comments/create-comment";
import { useEditComment } from "@/api/comments/edit-comment";
import { useGetCommentsInfinite } from "@/api/comments/comments";
import { useCreateReply } from "@/api/replies/create-reply";
import { useGetReplies } from "@/api/replies/replies";
import { useVoteComment } from "@/api/vote/vote-comments";
import { VoteType } from "@/enums/vote-type-enums";
import { useProtectedAction } from "@/hooks/use-protected-action";
import {
  createCommentSchema,
  type CreateCommentSchemaType,
} from "@/features/threads/pages/one-thread/schema/create-comment";
import type { Comments } from "@/types/comments";
import type { Reply } from "@/types/replies";

interface CommentItemProps {
  comment: Comments;
  commentId: string;
  isLoading: boolean;
}

/**
 * CommentItem Component
 *
 * @description Displays a single comment with options to reply, edit, delete, and vote.
 *
 * components used:
 * - ReplyItem
 * - FormTextArea
 *
 * @param {Comments} comment - The comment data to display.
 * @param {string} commentId - The ID of the comment.
 * @param {boolean} isLoading - Whether the comment is loading.
 *
 * @return {JSX.Element} The CommentItem component.
 * @example
 * <CommentItem comment={comment} commentId="123" isLoading={false} />
 */

function CommentItem({
  comment,
  commentId,
  isLoading = false,
}: CommentItemProps) {
  const {
    setReplyComment,
    setShowRepliesComment,
    isReplyCommentActive,
    isShowRepliesCommentActive,
    editingComment,
    setEditingComment,
  } = useReplyStore();

  const { mutateAsync, isPending: isVotePending } = useVoteComment();
  const { executeProtectedAction } = useProtectedAction();
  const { mutateAsync: createReply, isPending } = useCreateReply(() => {
    form.reset();
    setReplyComment(null);
  });

  const { mutateAsync: editComment, isPending: isEditPending } = useEditComment(
    () => {
      editForm.reset();
      setEditingComment(null);
    }
  );

  const { mutateAsync: deleteComment, isPending: isDeletePending } =
    useDeleteComment();

  const isUpvoted = comment.user_vote === VoteType.UPVOTE;
  const isDownvoted = comment.user_vote === VoteType.DOWNVOTE;
  const isReplyFormOpen = isReplyCommentActive(comment.id.toString());
  const isRepliesShown = isShowRepliesCommentActive(comment.id.toString());
  const { user } = useAuthStore();

  const { data: repliesData, isLoading: isLoadingReplies } = useGetReplies({
    params: {
      id: isRepliesShown ? commentId : "",
      perPage: 5,
    },
  });

  const replies: Reply[] =
    repliesData && Array.isArray(repliesData.data) ? repliesData.data : [];

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
    },
  });

  const editForm = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: comment.body,
    },
  });

  const handleSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          createReply({ commentId, body: form.getValues("body") }),
          {
            loading: "Posting comment...",
            success: "Comment posted successfully!",
            error: "Failed to post comment.",
          }
        );
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const editSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          editComment({ commentId, body: editForm.getValues("body") }),
          {
            loading: "Updating comment...",
            success: "Comment updated successfully!",
            error: "Failed to update comment.",
          }
        );
      });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await toast.promise(deleteComment(String(commentId)), {
        loading: "Deleting comment...",
        success: "Comment deleted successfully!",
        error: "Failed to delete comment.",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleVote = async (commentId: string, voteType: VoteType) => {
    await executeProtectedAction(async () => {
      try {
        await mutateAsync({
          votableId: Number(commentId),
          voteType,
        });
      } catch (error) {
        console.error("Vote failed:", error);
      }
    });
  };

  const handleReplyClick = () => {
    executeProtectedAction(() => {
      setReplyComment(comment.id.toString());
      form.setValue("body", `@${comment.author} `);
    });
  };

  const handleCancelReply = () => {
    setReplyComment(null);
    form.reset();
  };

  const handleShowRepliesClick = () => {
    setShowRepliesComment(comment.id.toString());
  };

  const handleEdit = () => {
    setEditingComment(comment.id.toString());
    editForm.setValue("body", comment.body);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    editForm.reset();
  };

  if (editingComment === comment.id.toString()) {
    return (
      <Form {...editForm}>
        <form onSubmit={editForm.handleSubmit(editSubmit)}>
          <section className="flex flex-col gap-4">
            <FormTextArea
              placeholder="Share your thoughts or ask a question..."
              className="min-h-20 text-xs md:text-sm"
              {...editForm.register("body")}
            />
            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="text-xs md:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs md:text-sm"
                disabled={isEditPending || editForm.formState.isSubmitting}
              >
                {isEditPending || editForm.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader className="size-3 md:size-4 animate-spin" />
                    <span className="text-xs md:text-sm">Updating...</span>
                  </div>
                ) : (
                  "Update Comment"
                )}
              </Button>
            </div>
          </section>
        </form>
      </Form>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <section className="flex items-center gap-2">
        <div className="flex-1">
          <div className="rounded-lg p-3 bg-gray-50">
            <div className="flex md:tems-center gap-2 mb-2 flex-col md:flex-row  text-muted-foreground text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <User className="size-3 md:size-4" />
                <span className="font-medium text-xs md:text-sm">
                  {comment.author}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3 md:size-4" />
                <span className="font-medium text-xs md:text-sm">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm leading-relaxed">{comment.body}</p>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplyClick}
                className="text-xs md:text-sm"
              >
                <ReplyIcon className="size-3 md:size-4" />
                Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowRepliesClick}
                className="text-xs md:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader className="size-3 md:size-4 animate-spin" />
                    Loading Replies...
                  </>
                ) : isRepliesShown ? (
                  <>
                    <ChevronUp className="size-3 md:size-4" />
                    Hide Replies ({comment.replies_count || 0})
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3 md:size-4" />
                    Show Replies ({comment.replies_count || 0})
                  </>
                )}
              </Button>
              {user?.name === comment.author && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <DeleteButton
                    loading={isDeletePending}
                    onDelete={handleDelete}
                    button
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <VoteButtons
                vote_score={comment.vote_score}
                handleUpVote={() =>
                  handleVote(comment.id.toString(), VoteType.UPVOTE)
                }
                handleDownVote={() =>
                  handleVote(comment.id.toString(), VoteType.DOWNVOTE)
                }
                upVoted={isUpvoted}
                downVoted={isDownvoted}
                direction="horizontal"
                isComputing={isVotePending}
              />
            </div>
          </div>

          {isReplyFormOpen && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4 p-2"
              >
                <section className="flex flex-col gap-4">
                  <FormTextArea
                    placeholder="Share your thoughts or ask a question..."
                    className="min-h-20 text-xs md:text-sm"
                    {...form.register("body")}
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelReply}
                      className="text-xs md:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="text-xs md:text-sm"
                      disabled={isPending || form.formState.isSubmitting}
                    >
                      {isPending || form.formState.isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader className="size-3 md:size-4 animate-spin" />
                          <span className="text-xs md:text-sm">Posting...</span>
                        </div>
                      ) : (
                        "Post Reply"
                      )}
                    </Button>
                  </div>
                </section>
              </form>
            </Form>
          )}
        </div>
      </section>

      {/* Replies */}
      {isRepliesShown && (
        <div>
          {isLoadingReplies ? (
            <div className="text-center py-4 text-muted-foreground text-xs md:text-sm">
              Loading replies...
            </div>
          ) : Array.isArray(replies) && replies.length > 0 ? (
            replies.map((reply: Reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                commentId={comment.id.toString()}
              />
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-xs md:text-sm">
              No replies yet.
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/**
 * CommentSection Component
 * @description Displays a section for comments on a thread, allowing users to post new comments and view existing ones.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardTitle
 * - Form
 * - FormTextArea
 * - Button
 * - LoadMoreButton
 * - CommentItem
 * - Skeleton (for loading state)
 *
 * @returns {JSX.Element} The CommentSection component.
 * @example
 * <CommentSection />
 */

export function CommentSection() {
  const { threadId } = useParams();
  const { selectedThreadTitle } = useThreadStore();
  const { executeProtectedAction } = useProtectedAction();
  const { user } = useAuthStore();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useGetCommentsInfinite({
      params: {
        threadId: threadId || "",
      },
    });

  const { mutateAsync, isPending } = useCreateComment(() => {
    form.reset();
  });

  const comments = data?.pages.flatMap((page) => page.data) || [];

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
    },
  });

  const handleSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          mutateAsync({
            threadId: threadId || "",
            body: form.getValues("body"),
          }),
          {
            loading: "Posting comment...",
            success: "Comment posted successfully!",
            error: "Failed to post comment.",
          }
        );
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <main className="flex flex-col gap-4 h-full">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div className="flex flex-col space-y-3 w-full" key={index}>
            <Skeleton className="h-36 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-3 md:size-4" />
              <p className="text-base md:text-lg">
                Comments ({comments?.length || 0})
              </p>
            </CardTitle>
            <p
              key={threadId || ""}
              className="text-xs md:text-sm text-muted-foreground"
            >
              Discussion: {selectedThreadTitle || "No title available"}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {/* New Comment Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4">
                  <FormTextArea
                    placeholder="Share your thoughts or ask a question..."
                    className="min-h-20 text-xs md:text-sm"
                    readonly={!user}
                    {...form.register("body")}
                  />
                  <Button
                    type="submit"
                    className="md:self-end text-xs md:text-sm"
                    disabled={
                      isPending ||
                      form.formState.isSubmitting ||
                      !form.formState.isValid
                    }
                  >
                    {isPending || form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader className="size-3 md:size-4 animate-spin" />
                        <span className="text-xs md:text-sm">Posting...</span>
                      </div>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            {/* Comments List */}
            {comments && comments.length > 0 && !isLoading ? (
              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    commentId={comment.id.toString()}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                <MessageSquare className="size-8 md:size-10" />
                <p className="text-xs md:text-sm">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}

            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export { CommentItem };
