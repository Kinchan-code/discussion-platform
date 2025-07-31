import { Loader, MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormTextArea } from '@/components/ui/form-textarea';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateComment } from '@/features/threads/pages/one-thread/api/create-comment';
import { CommentItem } from '@/features/threads/pages/one-thread/components/comment-item';
import {
  createCommentSchema,
  type CreateCommentSchemaType,
} from '@/features/threads/pages/one-thread/schema/create-comment';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { useAuthStore } from '@/store/auth-store';
import useReplyStore from '@/store/reply-store';
import { useThreadStore } from '@/store/thread-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGetCommentsInfinite } from '@/features/threads/pages/one-thread/api/comments';

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
 * @param {string} threadId - The ID of the thread to fetch comments for.
 * @param {string} selectedThreadTitle - The title of the selected thread, used for display.
 * @param {function} setHighlightComment - Function to set the highlighted comment ID.
 * @param {function} setHighlightReply - Function to set the highlighted reply ID.
 * @param {string} highlightCommentId - The ID of the comment to highlight.
 * @param {string} highlightReplyId - The ID of the reply to highlight.
 *
 * @returns {JSX.Element} The CommentSection component.
 * @example
 * <CommentSection threadId="123" selectedThreadTitle="Thread Title" />
 */

export function CommentSection({ threadId }: { threadId: string }) {
  const { selectedThreadTitle } = useThreadStore();
  const { executeProtectedAction } = useProtectedAction();
  const {
    highlightCommentId,
    highlightReplyId,
    setHighlightComment,
    setHighlightReply,
  } = useReplyStore();
  const { user } = useAuthStore();
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useGetCommentsInfinite({
      params: {
        threadId,
        highlightComment: highlightCommentId,
        highlightReply: highlightReplyId,
      },
    });

  const { mutateAsync, isPending } = useCreateComment(() => {
    form.reset();
  });

  const comments = data?.pages.flatMap((page) => page.data) || [];

  // Scroll to highlighted comment when highlightCommentId changes
  useEffect(() => {
    if (highlightCommentId && commentRefs.current[highlightCommentId]) {
      setTimeout(() => {
        commentRefs.current[highlightCommentId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [highlightCommentId, comments.length]); // Also depend on comments.length to ensure comments are loaded

  // Auto-clear highlights after 5 seconds
  useEffect(() => {
    if (highlightCommentId || highlightReplyId) {
      const timer = setTimeout(() => {
        if (highlightCommentId) setHighlightComment(null);
        if (highlightReplyId) setHighlightReply(null);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [
    highlightCommentId,
    highlightReplyId,
    setHighlightComment,
    setHighlightReply,
  ]);

  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: '',
    },
  });

  const handleSubmit = async () => {
    try {
      await executeProtectedAction(async () => {
        toast.promise(mutateAsync({ threadId, body: form.getValues('body') }), {
          loading: 'Posting comment...',
          success: 'Comment posted successfully!',
          error: 'Failed to post comment.',
        });
      });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <main className='flex flex-col gap-4 h-full'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            className='flex flex-col space-y-3 w-full'
            key={index}
          >
            <Skeleton className='h-36 w-full rounded-xl' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='size-3 md:size-4' />
              <p className='text-base md:text-lg'>
                Comments ({comments?.length || 0})
              </p>
            </CardTitle>
            <p
              key={threadId}
              className='text-xs md:text-sm text-muted-foreground'
            >
              Discussion: {selectedThreadTitle || 'No title available'}
            </p>
          </CardHeader>

          <CardContent className='flex flex-col gap-4'>
            {/* New Comment Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex flex-col gap-4'
              >
                <div className='flex flex-col gap-4'>
                  <FormTextArea
                    placeholder='Share your thoughts or ask a question...'
                    className='min-h-20 text-xs md:text-sm'
                    readonly={!user} // Make textarea read-only for anonymous users
                    {...form.register('body')}
                  />
                  <Button
                    type='submit'
                    className='md:self-end text-xs md:text-sm'
                    disabled={
                      isPending ||
                      form.formState.isSubmitting ||
                      !form.formState.isValid
                    }
                  >
                    {isPending || form.formState.isSubmitting ? (
                      <div className='flex items-center gap-2'>
                        <Loader className='size-3 md:size-4 animate-spin' />
                        <span className='text-xs md:text-sm'>Posting...</span>
                      </div>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            {/* Comments List */}
            {comments && comments.length > 0 && !isLoading ? (
              <div className='flex flex-col gap-4'>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    ref={(el: HTMLDivElement | null) => {
                      if (el) {
                        commentRefs.current[comment.id.toString()] = el;
                      }
                    }}
                    comment={comment}
                    commentId={comment.id.toString()}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground flex flex-col items-center gap-2'>
                <MessageSquare className='size-8 md:size-10' />
                <p className='text-xs md:text-sm'>
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
