import { toast } from 'sonner';

import { useDeleteThread } from '@/api/delete-thread';
import { LoadMoreButton } from '@/components/ui/load-more-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetThreadsInfinite } from '@/features/threads/api/threads';
import ThreadsCard from '@/features/threads/components/threads-card';
import { useAuthStore } from '@/store/auth-store';

import type { Threads } from '@/models/threads';

/**
 * Threads Page Component
 *
 * @description Displays a list of threads created by the user with options to delete threads.
 *
 * components used:
 * - ThreadsCard: Displays the threads with options to delete.
 * - LoadMoreButton: Button to load more threads.
 * - Skeleton: Placeholder for loading state.
 *
 * @param {Object} props - The properties for the Threads component.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {boolean} props.isOpen - Whether the dropdown menu is open.
 * @param {function} props.setIsOpen - Function to set the open state of the dropdown menu.
 *
 * @returns {JSX.Element} The Threads component.
 * @example
 * <Threads />
 */

function Threads() {
  const { user } = useAuthStore();

  const { mutateAsync: deleteThread, isPending } = useDeleteThread();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetThreadsInfinite({
      params: {
        sort: 'recent',
        author: user?.name || 'current_user',
        perPage: 5,
      },
    });

  const threads = data?.pages.flatMap((page) => page.data as Threads[]) || [];

  const handleDelete = async (threadId: number) => {
    try {
      await toast.promise(deleteThread(threadId), {
        loading: 'Deleting thread...',
        success: 'Thread deleted successfully!',
        error: 'Error deleting thread',
      });
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  return (
    <main>
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
          <ThreadsCard
            thread={threads}
            actions={true}
            isDeleting={isPending}
            onDelete={handleDelete}
          />

          {threads.length === 0 ? (
            <p className='text-xs md:text-sm text-center italic text-muted-foreground'>
              No threads found. Create one to contribute.
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

export default Threads;
