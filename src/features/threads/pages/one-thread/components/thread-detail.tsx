import { AlertCircleIcon, Calendar, User } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useDeleteThread } from '@/api/delete-thread';
import DeleteButton from '@/components/delete-button';
import EditButton from '@/components/edit-button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VoteButtons } from '@/components/vote-buttons';
import { useVoteThread } from '@/features/threads/api/vote-thread';
import { useGetOneThread } from '@/features/threads/pages/one-thread/api/one-thread';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { PathName } from '@/models/path-enums';
import { useAuthStore } from '@/store/auth-store';
import { useThreadStore } from '@/store/thread-store';
import { useVoteThreadStore } from '@/store/vote-thread-store';

/**
 * ThreadDetail Component
 *
 * @description Displays the details of a single thread, including title, author, creation date, and content.
 * Allows users to vote on the thread, edit it if they are the author, and delete it.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - Badge
 * - VoteButtons
 * - EditButton
 * - DeleteButton
 * - AlertDialog
 *
 * @param {string} threadId - The ID of the thread to display.
 * @param {boolean} isPending - Whether the thread data is still being fetched.
 * @param {boolean} isError - Whether there was an error fetching the thread data.
 * @param {Error} error - The error object if there was an error fetching the thread data.
 *
 * @returns {JSX.Element} The ThreadDetail component.
 * @example
 * <ThreadDetail />
 */

function ThreadDetail() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const {
    data: thread,
    isPending,
    isError,
    error,
  } = useGetOneThread(threadId || '');
  const { mutateAsync: deleteThread, isPending: isDeleting } = useDeleteThread(
    () => {
      navigate(PathName.THREADS);
    }
  );
  const { mutateAsync } = useVoteThread();
  const { executeProtectedAction } = useProtectedAction();
  const { hasUpvoted, hasDownvoted } = useVoteThreadStore();
  const { setSelectedThread } = useThreadStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (thread) {
      setSelectedThread(thread.data.title || null);
    }
  }, [thread, setSelectedThread]);

  // Handle error state first (before loading check)
  if (isError) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className='flex flex-col items-center gap-8 w-max-sm'>
          <AlertDialogHeader className='flex flex-col items-center gap-4'>
            <AlertDialogTitle className='text-center text-red-500'>
              <AlertCircleIcon className='size-12 md:size-20' />
            </AlertDialogTitle>
            <AlertDialogDescription className='text-xs md:text-sm text-center text-muted-foreground'>
              <p className='flex flex-col gap-4'>
                <span>
                  {error?.message ||
                    'This protocol may have been deleted or does not exist.'}
                </span>
                <span>
                  {error.status_code === 404
                    ? 'The protocol you are looking for does not exist. You can browse other protocols or create a new one.'
                    : 'This protocol may have been deleted or does not exist. Please try again later.'}
                </span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex justify-center items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button onClick={() => navigate(PathName.THREADS)}>
              View Threads
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const handleVote = async (threadId: string, vote: 'upvote' | 'downvote') => {
    await executeProtectedAction(async () => {
      try {
        await mutateAsync({ threadId, vote });
      } catch (error) {
        console.error('Vote failed:', error);
      }
    });
  };

  const isUpvoted = hasUpvoted(thread?.data?.id || 0);
  const isDownvoted = hasDownvoted(thread?.data?.id || 0);

  const handleEdit = () => {
    // Navigate to edit thread page
    navigate(`${PathName.THREADS}/${threadId}/edit`);
  };

  const handleDelete = async () => {
    try {
      toast.promise(deleteThread(Number(threadId)), {
        loading: 'Deleting thread...',
        success: 'Thread deleted successfully!',
        error: 'Error deleting thread',
      });
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  return (
    <main className='flex flex-col gap-4 h-full'>
      {isPending ? (
        <div className='flex flex-col space-y-3 w-full'>
          <Skeleton className='h-40 w-full rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
          </div>
        </div>
      ) : (
        <Card className='flex flex-col gap-2 '>
          <CardHeader>
            <section className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
              <div className='flex items-center gap-4 justify-between'>
                <div className='flex flex-col gap-4'>
                  <h1 className='text-base md:text-2xl font-bold leading-tight w-full'>
                    {thread?.data.title}
                  </h1>

                  <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground w-full'>
                    <div className='flex items-center gap-1'>
                      <User className='size-3 md:size-4' />
                      <span className='text-xs md:text-sm'>
                        {thread?.data.author}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='size-3 md:size-4' />
                      <span className='text-xs md:text-sm'>
                        {thread?.data.created_at
                          ? new Date(
                              thread.data.created_at
                            ).toLocaleDateString()
                          : '---'}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant='outline'
                    className='text-xs md:text-sm rounded-xl'
                  >
                    Related to: {thread?.data.protocol.title || ''}
                  </Badge>
                </div>
                {user?.name === thread?.data.author && (
                  <div
                    id='actions'
                    className='flex items-center gap-2'
                  >
                    <EditButton onClick={handleEdit} />
                    <DeleteButton
                      loading={isDeleting}
                      onDelete={handleDelete}
                    />
                  </div>
                )}
              </div>
            </section>
          </CardHeader>

          <CardContent>
            <main className='prose prose-sm max-w-none flex flex-col gap-4'>
              <div className='whitespace-pre-wrap text-gray-600 text-xs md:text-sm'>
                {thread?.data.body}
              </div>
              <section className='self-end'>
                <VoteButtons
                  vote_score={thread?.data.vote_score || 0}
                  handleUpVote={() =>
                    handleVote(thread?.data?.id.toString() || '', 'upvote')
                  }
                  handleDownVote={() =>
                    handleVote(thread?.data?.id.toString() || '', 'downvote')
                  }
                  upVoted={isUpvoted}
                  downVoted={isDownvoted}
                  align='left'
                  direction='horizontal'
                />
              </section>
            </main>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default ThreadDetail;
