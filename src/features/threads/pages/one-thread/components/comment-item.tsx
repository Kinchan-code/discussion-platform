import {
  ChevronDown,
  ChevronUp,
  Clock,
  Loader,
  Reply,
  User,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useDeleteCommentReply } from '@/api/delete-comment-reply';
import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button/button';
import { Form } from '@/components/ui/form';
import { FormTextArea } from '@/components/ui/form-textarea';
import { VoteButtons } from '@/components/vote-buttons';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { useAuthStore } from '@/store/auth-store';
import useReplyStore from '@/store/reply-store';
import { useVoteCommentStore } from '@/store/vote-comment-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateReply } from '../api/create-reply';
import { useEditComment } from '../api/edit-comment';
import { useVoteComment } from '../api/vote-comments';
import {
  createCommentSchema,
  type CreateCommentSchemaType,
} from '@/features/threads/pages/one-thread/schema/create-comment';
import { ReplyItem } from '@/features/threads/pages/one-thread/components/reply-item';

import type { Comments } from '@/models/comments';
import type { Replies } from '@/models/replies';

// Helper function to check if any reply in a comment tree matches the highlighted reply
const hasHighlightedReply = (
  replies: Replies[],
  targetReplyId: string
): boolean => {
  return replies.some((reply) => {
    if (reply.id.toString() === targetReplyId) return true;
    if (reply.nested_replies && reply.nested_replies.length > 0) {
      return hasHighlightedReply(
        reply.nested_replies as Replies[],
        targetReplyId
      );
    }
    return false;
  });
};

interface CommentItemProps {
  comment: Comments;
  commentId: string;
  isLoading: boolean;
  ref?: React.Ref<HTMLDivElement>;
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
 * @param {React.Ref<HTMLDivElement>} ref - The ref to attach to the comment container.
 *
 * @return {JSX.Element} The CommentItem component.
 * @example
 * <CommentItem comment={comment} commentId="123" isLoading={false} />
 */

function CommentItem({
  comment,
  commentId,
  isLoading = false,
  ref,
}: CommentItemProps) {
  const {
    setReplyComment,
    setShowRepliesComment,
    isReplyCommentActive,
    isShowRepliesCommentActive,
    highlightCommentId,
    highlightReplyId,
    editingComment,
    setEditingComment,
  } = useReplyStore();

  const { mutateAsync, isPending: isVotePending } = useVoteComment();
  const { executeProtectedAction } = useProtectedAction();
  const { hasUpvoted, hasDownvoted } = useVoteCommentStore();
  const { mutateAsync: createReply, isPending } = useCreateReply(() => {
    form.reset();
    setReplyComment(null); // Close the form after successful submission
  });

  const { mutateAsync: editComment, isPending: isEditPending } = useEditComment(
    () => {
      editForm.reset();
      setEditingComment(null); // Close the edit form after successful submission
    }
  );

  const { mutateAsync: deleteComment, isPending: isDeletePending } =
    useDeleteCommentReply();

  const isUpvoted = hasUpvoted(comment.id);
  const isDownvoted = hasDownvoted(comment.id);
  const isReplyFormOpen = isReplyCommentActive(comment.id.toString());
  const isRepliesShown = isShowRepliesCommentActive(comment.id.toString());
  const isHighlight = comment.id.toString() === highlightCommentId;
  const { user } = useAuthStore();

  const replyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto-show replies if this comment contains the highlighted reply
  useEffect(() => {
    if (highlightReplyId && comment.replies && comment.replies.length > 0) {
      const shouldShowReplies = hasHighlightedReply(
        comment.replies,
        highlightReplyId
      );
      if (
        shouldShowReplies &&
        !isShowRepliesCommentActive(comment.id.toString())
      ) {
        setShowRepliesComment(comment.id.toString());
      }
    }
  }, [
    highlightReplyId,
    comment.replies,
    comment.id,
    setShowRepliesComment,
    isShowRepliesCommentActive,
  ]);

  // Scroll to highlighted reply when highlightReplyId changes
  useEffect(() => {
    if (highlightReplyId && replyRefs.current[highlightReplyId]) {
      setTimeout(() => {
        replyRefs.current[highlightReplyId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [highlightReplyId, comment.replies?.length]); // Also depend on replies length to ensure replies are loaded

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: '',
    },
  });

  const editForm = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: comment.body, // Pre-fill with existing comment body
    },
  });

  const handleSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          createReply({ commentId, body: form.getValues('body') }),
          {
            loading: 'Posting comment...',
            success: 'Comment posted successfully!',
            error: 'Failed to post comment.',
          }
        );
      });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const editSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(
          editComment({ commentId, body: editForm.getValues('body') }),
          {
            loading: 'Updating comment...',
            success: 'Comment updated successfully!',
            error: 'Failed to update comment.',
          }
        );
      });
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await toast.promise(deleteComment(Number(commentId)), {
        loading: 'Deleting comment...',
        success: 'Comment deleted successfully!',
        error: 'Failed to delete comment.',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleVote = async (commentId: string, vote: 'upvote' | 'downvote') => {
    await executeProtectedAction(async () => {
      try {
        await mutateAsync({ commentId, vote });
      } catch (error) {
        console.error('Vote failed:', error);
      }
    });
  };

  const handleReplyClick = () => {
    executeProtectedAction(() => {
      setReplyComment(comment.id.toString());
      // Auto-populate textarea with commenter's name
      form.setValue('body', `@${comment.author} `);
    });
  };

  const handleCancelReply = () => {
    setReplyComment(null);
    form.reset(); // Clear the form when canceling
  };

  const handleShowRepliesClick = () => {
    setShowRepliesComment(comment.id.toString());
  };

  const handleEdit = () => {
    setEditingComment(comment.id.toString());
    editForm.setValue('body', comment.body); // Pre-fill the editForm with the existing comment body
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    editForm.reset(); // Clear the form when canceling
  };

  if (editingComment === comment.id.toString()) {
    return (
      <Form {...editForm}>
        <form onSubmit={editForm.handleSubmit(editSubmit)}>
          <section className='flex flex-col gap-4'>
            <FormTextArea
              placeholder='Share your thoughts or ask a question...'
              className='min-h-20 text-xs md:text-sm'
              {...editForm.register('body')}
            />
            <div className='flex items-center gap-2 justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancelEdit}
                className='text-xs md:text-sm'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='text-xs md:text-sm'
                disabled={isEditPending || editForm.formState.isSubmitting}
              >
                {isEditPending || editForm.formState.isSubmitting ? (
                  <div className='flex items-center gap-2'>
                    <Loader className='size-3 md:size-4 animate-spin' />
                    <span className='text-xs md:text-sm'>Updating...</span>
                  </div>
                ) : (
                  'Update Comment'
                )}
              </Button>
            </div>
          </section>
        </form>
      </Form>
    );
  }

  return (
    <main
      ref={ref}
      className='flex flex-col gap-4'
    >
      <section className='flex items-center gap-2'>
        <div className='flex-1'>
          <div
            className={`rounded-lg p-3 ${
              isHighlight
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-gray-50'
            }`}
          >
            <div className='flex md:tems-center gap-2 mb-2 flex-col md:flex-row  text-muted-foreground text-xs md:text-sm'>
              <div className='flex items-center gap-2'>
                <User className='size-3 md:size-4' />
                <span className='font-medium text-xs md:text-sm'>
                  {comment.author}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='size-3 md:size-4' />
                <span className='font-medium text-xs md:text-sm'>
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <p className='text-xs md:text-sm leading-relaxed'>{comment.body}</p>
          </div>

          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center flex-wrap'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleReplyClick}
                className='text-xs md:text-sm'
              >
                <Reply className='size-3 md:size-4' />
                Reply
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleShowRepliesClick}
                className='text-xs md:text-sm'
              >
                {isLoading ? (
                  <>
                    <Loader className='size-3 md:size-4 animate-spin' />
                    Loading Replies...
                  </>
                ) : isRepliesShown ? (
                  <>
                    <ChevronUp className='size-3 md:size-4' />
                    Hide Replies ({comment.replies_count || 0})
                  </>
                ) : (
                  <>
                    <ChevronDown className='size-3 md:size-4' />
                    Show Replies ({comment.replies_count || 0})
                  </>
                )}
              </Button>
              {user?.name === comment.author && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs md:text-sm'
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
            <div className='flex justify-end'>
              <VoteButtons
                vote_score={comment.vote_score}
                handleUpVote={() => handleVote(comment.id.toString(), 'upvote')}
                handleDownVote={() =>
                  handleVote(comment.id.toString(), 'downvote')
                }
                upVoted={isUpvoted}
                downVoted={isDownvoted}
                direction='horizontal'
                isComputing={isVotePending}
              />
            </div>
          </div>

          {isReplyFormOpen && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex flex-col gap-4 p-2'
              >
                <section className='flex flex-col gap-4'>
                  <FormTextArea
                    placeholder='Share your thoughts or ask a question...'
                    className='min-h-20 text-xs md:text-sm'
                    {...form.register('body')}
                  />
                  <div className='flex items-center gap-2 justify-end'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancelReply}
                      className='text-xs md:text-sm'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className='text-xs md:text-sm'
                      disabled={isPending || form.formState.isSubmitting}
                    >
                      {isPending || form.formState.isSubmitting ? (
                        <div className='flex items-center gap-2'>
                          <Loader className='size-3 md:size-4 animate-spin' />
                          <span className='text-xs md:text-sm'>Posting...</span>
                        </div>
                      ) : (
                        'Post Reply'
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
      {isRepliesShown && comment?.replies && comment.replies.length > 0 && (
        <div className='space-y-4'>
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  replyRefs.current[reply.id.toString()] = el;
                }
              }}
              reply={reply}
              commentId={comment.id.toString()}
              highlightReply={highlightReplyId || undefined}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export { CommentItem };
