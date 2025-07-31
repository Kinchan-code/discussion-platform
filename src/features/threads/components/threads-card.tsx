import { CalendarIcon, MessageSquareIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DeleteButton from '@/components/delete-button';
import EditButton from '@/components/edit-button';
import { Badge } from '@/components/ui/badge/badge';
import { Card } from '@/components/ui/card';
import { VoteButtons } from '@/components/vote-buttons';
import { useVoteThread } from '@/features/threads/api/vote-thread';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { PathName } from '@/models/path-enums';
import { useAuthStore } from '@/store/auth-store';
import { useVoteThreadStore } from '@/store/vote-thread-store';

import type { Threads } from '@/models/threads';

interface ThreadsCardProps {
  thread: Threads[];
  actions?: boolean;
  onDelete?: (threadId: number) => void;
  isDeleting?: boolean;
}

/**
 * ThreadsCard Component
 *
 * @description Displays a card for each thread with voting, editing, and deleting options.
 *
 * components used:
 * - Card - for displaying thread information.
 * - Link - for navigation to thread details.
 * - Badge - for displaying thread tags.
 * - VoteButtons - for upvoting and downvoting threads.
 * - DeleteButton - for deleting threads.
 * - EditButton - for editing threads.
 * - UserIcon - for displaying the author's avatar.
 * - CalendarIcon - for displaying the thread's creation date.
 * - MessageSquareIcon - for displaying the thread's comment count.

 * @param {Threads[]} thread - The thread data to display.
 * @param {boolean} actions - Whether to show edit and delete actions.
 * @param {function} onDelete - Function to call when deleting a thread.
 * @param {boolean} isDeleting - Whether a delete action is in progress.
 *  
 * @returns {JSX.Element} The ThreadsCard component.
 * @example
 * <ThreadsCard
 */

function ThreadsCard({
  thread,
  actions = false,
  onDelete,
  isDeleting,
}: ThreadsCardProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { mutateAsync } = useVoteThread();
  const { executeProtectedAction } = useProtectedAction();
  const { hasUpvoted, hasDownvoted } = useVoteThreadStore();

  // Track which specific thread is being voted on
  const [votingThreadId, setVotingThreadId] = useState<string | null>(null);

  const handleVote = async (threadId: string, vote: 'upvote' | 'downvote') => {
    await executeProtectedAction(async () => {
      try {
        setVotingThreadId(threadId); // Set which thread is being voted on
        await mutateAsync({ threadId, vote });
      } catch (error) {
        console.error('Vote failed:', error);
      } finally {
        setVotingThreadId(null); // Reset after vote completes (success or error)
      }
    });
  };

  const handleEdit = (threadId: number) => {
    navigate(`${PathName.THREADS}/${threadId}/edit`);
  };

  return thread.map((thread) => {
    const isUpvoted = hasUpvoted(thread.id);
    const isDownvoted = hasDownvoted(thread.id);

    // Check if this specific thread is being voted on
    const isThisThreadVoting = votingThreadId === thread.id.toString();

    return (
      <Card
        key={thread.id}
        className='p-4 cursor-pointer'
      >
        <main className='flex items-center flex-col-reverse md:flex-row gap-2'>
          <section
            id='vote-thread-buttons'
            className='w-full md:w-auto'
          >
            <VoteButtons
              vote_score={thread.vote_score}
              handleUpVote={() => handleVote(thread.id.toString(), 'upvote')}
              handleDownVote={() =>
                handleVote(thread.id.toString(), 'downvote')
              }
              upVoted={isUpvoted}
              downVoted={isDownvoted}
              isComputing={isThisThreadVoting}
            />
          </section>
          <section className='w-full flex flex-col gap-2'>
            <header className='flex items-center gap-2 justify-between'>
              <Link to={`${PathName.THREADS}/${thread.id}`}>
                <h3 className='font-semibold text-sm md:text-lg leading-tight hover:text-blue-500 hover:underline transition-colors'>
                  {thread.title}
                </h3>
              </Link>
              {actions && user?.name === thread.author && (
                <div className='flex items-center gap-2'>
                  <EditButton onClick={() => handleEdit(thread.id)} />
                  <DeleteButton
                    loading={isDeleting}
                    onDelete={() => onDelete?.(thread.id)}
                  />
                </div>
              )}
            </header>
            <div className='flex flex-col gap-2 max-w-6xl'>
              <p className='text-xs md:text-sm text-muted-foreground'>
                {thread.body}
              </p>
              {thread.protocol && (
                <Badge
                  variant='outline'
                  className='text-xs md:text-sm rounded-xl'
                >
                  {thread.protocol.title}
                </Badge>
              )}
            </div>
            <footer className='flex items-center gap-2 text-muted-foreground'>
              <div className='flex  flex-col w-full md:flex-row gap-2 md:gap-4'>
                <div className='flex items-center gap-2'>
                  <UserIcon className='size-3 md:size-4' />
                  <p className='text-xs font-normal'>{thread.author}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='size-3 md:size-4' />
                  <p className='text-xs font-normal'>
                    {new Date(thread.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex flex-1 items-center justify-start md:justify-end w-full gap-2'>
                  <MessageSquareIcon className='size-3 md:size-4' />
                  <p className='text-xs font-normal'>
                    {thread.comments_count} replies
                  </p>
                </div>
              </div>
            </footer>
          </section>
        </main>
      </Card>
    );
  });
}

export default ThreadsCard;
