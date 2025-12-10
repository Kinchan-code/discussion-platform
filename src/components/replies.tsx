import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Clock, Loader, Reply as ReplyIcon, User } from "lucide-react";
import DeleteButton from "@/components/delete-button";
import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { FormTextArea } from "@/components/ui/form-textarea";
import { VoteButtons } from "@/components/vote-buttons";
import { useAuthStore } from "@/store/auth-store";
import useReplyStore from "@/store/reply-store";
import { useCreateNestedReply } from "@/api/replies/create-nested-reply";
import { useDeleteReply } from "@/api/replies/delete-reply";
import { useEditReply } from "@/api/replies/edit-reply";
import { useGetNestedReplies } from "@/api/replies/nested-replies";
import { useVoteReply } from "@/api/vote/vote-replies";
import { VoteType } from "@/enums/vote-type-enums";
import { useProtectedAction } from "@/hooks/use-protected-action";
import { cn } from "@/lib/utils";
import {
  createCommentSchema,
  type CreateCommentSchemaType,
} from "@/features/threads/pages/one-thread/schema/create-comment";

import type { Reply } from "@/types/replies";

/**
 * ReplyItem Component
 * @description Displays a single reply to a comment with options to reply, edit, delete, and vote.
 *
 * components used:
 * - Form
 * - FormTextArea
 * - Button
 * - DeleteButton
 * - VoteButtons
 * - User (icon)
 * - Clock (icon)
 * - Reply (icon)
 *
 * @param {Reply} reply - The reply data to display.
 * @param {string} commentId - The ID of the comment this reply belongs to.
 * @param {boolean} margin - Whether to apply margin to the reply item.
 *
 * @returns {JSX.Element} The ReplyItem component.
 */

interface ReplyItemProps {
  reply: Reply;
  commentId: string;
  margin?: boolean;
  depth?: number;
}

export function ReplyItem({
  reply,
  commentId,
  margin = true,
  depth = 1,
}: ReplyItemProps) {
  const {
    setReplyReply,
    isReplyReplyActive,
    editingReply,
    setEditingReply,
    setShowRepliesReply,
    isShowRepliesReplyActive,
  } = useReplyStore();
  const { mutateAsync, isPending: isVotePending } = useVoteReply();
  const { executeProtectedAction } = useProtectedAction();
  const { user } = useAuthStore();

  const { mutateAsync: createNestedReply, isPending } = useCreateNestedReply(
    () => {
      form.reset();
      setReplyReply(null);
    }
  );

  const { mutateAsync: editReply, isPending: isEditPending } = useEditReply(
    () => {
      editForm.reset();
      setEditingReply(null);
    }
  );

  const { mutateAsync: deleteReply, isPending: isDeletePending } =
    useDeleteReply();

  const isUpvoted = reply.user_vote === VoteType.UPVOTE;
  const isDownvoted = reply.user_vote === VoteType.DOWNVOTE;
  const isReplyFormOpen = isReplyReplyActive(reply.id.toString());
  const isNestedRepliesShown = isShowRepliesReplyActive(reply.id.toString());

  const { data: nestedRepliesData, isLoading: isLoadingNestedReplies } =
    useGetNestedReplies({
      params: {
        id: isNestedRepliesShown ? reply.id.toString() : "",
        perPage: 5,
      },
    });

  const nestedReplies: Reply[] =
    nestedRepliesData && Array.isArray(nestedRepliesData.data)
      ? nestedRepliesData.data
      : [];

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
    },
  });

  const editForm = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: reply.body,
    },
  });

  const handleSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          createNestedReply({
            replyId: reply.id.toString(),
            body: form.getValues("body"),
          }),
          {
            loading: "Posting reply...",
            success: "Reply posted successfully!",
            error: "Failed to post reply.",
          }
        );
      });
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const editSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          editReply({
            replyId: reply.id.toString(),
            body: editForm.getValues("body"),
          }),
          {
            loading: "Updating reply...",
            success: "Reply updated successfully!",
            error: "Failed to update reply.",
          }
        );
      });
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await toast.promise(deleteReply(reply.id.toString()), {
        loading: "Deleting reply...",
        success: "Reply deleted successfully!",
        error: "Failed to delete reply.",
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleVote = async (replyId: string, voteType: VoteType) => {
    await executeProtectedAction(async () => {
      try {
        await mutateAsync({
          votableId: Number(replyId),
          voteType,
        });
      } catch (error) {
        console.error("Vote failed:", error);
      }
    });
  };

  const handleReplyClick = () => {
    executeProtectedAction(() => {
      setReplyReply(reply.id.toString());
      form.setValue("body", `@${reply.author} `);
    });
  };

  const handleCancelReply = () => {
    setReplyReply(null);
    form.reset();
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    editForm.reset();
  };

  const handleEdit = () => {
    setEditingReply(reply.id.toString());
    editForm.setValue("body", reply.body);
  };

  const handleShowNestedRepliesClick = () => {
    setShowRepliesReply(reply.id.toString());
  };

  if (editingReply === reply.id.toString()) {
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
                  "Update Reply"
                )}
              </Button>
            </div>
          </section>
        </form>
      </Form>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 border-l-2 border-gray-200",
        margin && depth === 1 && "ml-4 md:ml-8",
        margin && depth === 2 && "ml-8 md:ml-16"
      )}
    >
      <div className="flex-1 py-2 pl-2">
        <div className="rounded-lg p-3 bg-gray-50">
          <div className="flex md:items-center gap-2 mb-2 flex-col md:flex-row text-muted-foreground text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <User className="size-3 md:size-4" />
              <span className="font-medium">{reply.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3 md:size-4" />
              <span>
                {new Date(reply.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm leading-relaxed">{reply.body}</p>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="text-xs md:text-sm"
            >
              <ReplyIcon className="size-3 md:size-4" />
              Reply
            </Button>
            {reply.nested_replies_count > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowNestedRepliesClick}
                className="text-xs md:text-sm"
              >
                {isLoadingNestedReplies ? (
                  <>
                    <Loader className="size-3 md:size-4 animate-spin" />
                    Loading...
                  </>
                ) : isNestedRepliesShown ? (
                  "Hide Replies"
                ) : (
                  `Show Replies (${reply.nested_replies_count})`
                )}
              </Button>
            )}
            {user?.name === reply.author && (
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

          <VoteButtons
            vote_score={reply.vote_score}
            handleUpVote={() =>
              handleVote(reply.id.toString(), VoteType.UPVOTE)
            }
            handleDownVote={() =>
              handleVote(reply.id.toString(), VoteType.DOWNVOTE)
            }
            upVoted={isUpvoted}
            downVoted={isDownvoted}
            direction="horizontal"
            isComputing={isVotePending}
          />
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

        {/* Nested replies */}
        {isNestedRepliesShown && (
          <div>
            {isLoadingNestedReplies ? (
              <div className="text-center py-4 text-muted-foreground text-xs md:text-sm">
                Loading replies...
              </div>
            ) : nestedReplies && nestedReplies.length > 0 ? (
              nestedReplies.map((nestedReply: Reply) => (
                <ReplyItem
                  key={nestedReply.id}
                  reply={nestedReply}
                  commentId={commentId}
                  margin={true}
                  depth={2}
                />
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-xs md:text-sm">
                No replies yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
