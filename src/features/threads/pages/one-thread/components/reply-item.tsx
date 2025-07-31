import { Clock, Loader, Reply, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useDeleteCommentReply } from '@/api/delete-comment-reply';
import DeleteButton from '@/components/delete-button';
import { Button } from '@/components/ui/button/button';
import { Form } from '@/components/ui/form';
import { FormTextArea } from '@/components/ui/form-textarea';
import { VoteButtons } from '@/components/vote-buttons';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { cn } from '@/lib/utils';
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

import type { Replies } from '@/models/replies';

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
 * @param {Replies} reply - The reply data to display.
 * @param {string} commentId - The ID of the comment this reply belongs to.
 * @param {boolean} margin - Whether to apply margin to the reply item.
 * @param {string} highlightReply - ID of the reply to highlight.
 *
 * @returns {JSX.Element} The ReplyItem component.
 */

interface ReplyItemProps {
  reply: Replies;
  commentId: string;
  margin?: boolean; // Optional prop to control margin
  highlightReply?: string; // ID of reply to highlight
  ref?: React.Ref<HTMLDivElement>;
}

export function ReplyItem({
  reply,
  commentId,
  margin = true,
  highlightReply,
  ref,
}: ReplyItemProps) {
  const { setReplyReply, isReplyReplyActive, editingReply, setEditingReply } =
    useReplyStore();
  const { mutateAsync: voteReply, isPending: isVotePending } = useVoteComment();
  const { executeProtectedAction } = useProtectedAction();
  const { hasUpvoted, hasDownvoted } = useVoteCommentStore();
  const { user } = useAuthStore();

  const { mutateAsync: createReply, isPending } = useCreateReply(() => {
    form.reset();
    setReplyReply(null); // Close the form after successful submission
  });

  const { mutateAsync: editReply, isPending: isEditPending } = useEditComment(
    () => {
      editForm.reset();
      setEditingReply(null); // Close the edit form after successful submission
    }
  );

  const { mutateAsync: deleteComment, isPending: isDeletePending } =
    useDeleteCommentReply();

  const isUpvoted = hasUpvoted(reply.id);
  const isDownvoted = hasDownvoted(reply.id);
  const isReplyFormOpen = isReplyReplyActive(reply.id.toString());
  const isHighlighted = highlightReply === reply.id.toString();

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: '',
    },
  });

  const editForm = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: reply.body, // Pre-fill with existing reply body
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
          editReply({
            commentId: reply.id.toString(),
            body: editForm.getValues('body'),
          }),
          {
            loading: 'Updating reply...',
            success: 'Reply updated successfully!',
            error: 'Failed to update reply.',
          }
        );
      });
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await toast.promise(deleteComment(Number(reply.id)), {
        loading: 'Deleting reply...',
        success: 'Reply deleted successfully!',
        error: 'Failed to delete reply.',
      });
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleVote = async (commentId: string, vote: 'upvote' | 'downvote') => {
    await executeProtectedAction(async () => {
      try {
        await voteReply({ commentId, vote });
      } catch (error) {
        console.error('Vote failed:', error);
      }
    });
  };

  const handleReplyClick = () => {
    executeProtectedAction(() => {
      setReplyReply(reply.id.toString());
      // Auto-populate textarea with commenter's name
      form.setValue('body', `@${reply.author} `);
    });
  };

  const handleCancelReply = () => {
    setReplyReply(null);
    form.reset(); // Clear the form when canceling
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    editForm.reset(); // Clear the form when canceling
  };

  const handleEdit = () => {
    setEditingReply(reply.id.toString());
    editForm.setValue('body', reply.body); // Pre-fill the editForm with the existing reply body
  };

  if (editingReply === reply.id.toString()) {
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
                  'Update Reply'
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
      ref={ref}
      className={cn(
        'flex gap-3  border-l-2 border-gray-200' +
          (margin ? ' ml-4 md:ml-8' : '')
      )}
    >
      <div className='flex-1'>
        <div
          className={`rounded-lg p-3 ${
            isHighlighted
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50'
          }`}
        >
          <div className='flex md:items-center gap-2 mb-2 flex-col md:flex-row text-muted-foreground text-xs md:text-sm'>
            <div className='flex items-center gap-1'>
              <User className='size-3 md:size-4' />
              <span className='font-medium'>{reply.author}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='size-3 md:size-4' />
              <span>
                {new Date(reply.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <p className='text-xs md:text-sm leading-relaxed'>{reply.body}</p>
        </div>

        <div className='flex items-center gap-2 justify-between'>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleReplyClick}
              className='text-xs md:text-sm'
            >
              <Reply className='size-3 md:size-4' />
              Reply
            </Button>
            {user?.name === reply.author && (
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

          <VoteButtons
            vote_score={reply.vote_score}
            handleUpVote={() => handleVote(reply.id.toString(), 'upvote')}
            handleDownVote={() => handleVote(reply.id.toString(), 'downvote')}
            upVoted={isUpvoted}
            downVoted={isDownvoted}
            direction='horizontal'
            isComputing={isVotePending}
          />
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

        {/* Nested replies */}
        {reply.nested_replies && reply.nested_replies.length > 0 && (
          <div className=''>
            {reply.nested_replies.map((nestedReply) => (
              <ReplyItem
                key={nestedReply.id}
                reply={nestedReply as Replies}
                commentId={commentId}
                margin={false} // No margin for nested replies
                highlightReply={highlightReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
