import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetThreadsByProtocolInfinite } from '@/features/protocols/pages/one-protocol/api/threads-by-protocol';
import ThreadsCard from '@/features/threads/components/threads-card';
import { useProtectedAction } from '@/hooks/use-protected-action';
import { PathName } from '@/models/path-enums';

/**
 * ProtocolThreadList Component
 * @description Displays a list of threads for a specific protocol.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - Button
 * - Skeleton
 * - ThreadsCard
 *
 * @returns {JSX.Element} The ProtocolThreadList component.
 * @example
 * <ProtocolThreadList />
 */

function ProtocolThreadList() {
  const { protocolId } = useParams();
  const navigate = useNavigate();
  const { executeProtectedAction } = useProtectedAction();

  const { data: infiniteThreads, isLoading } = useGetThreadsByProtocolInfinite({
    protocolId: protocolId || '',
  });

  const threads = infiniteThreads?.pages.flatMap((page) => page.data) || [];

  const handleCreateThread = () => {
    executeProtectedAction(() => {
      navigate(`${PathName.CREATE_THREAD}?protocol=${protocolId}`);
    });
  };

  const handleViewAllDiscussions = () => {
    navigate(`${PathName.THREADS}?protocol=${protocolId}`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center flex-col gap-4 justify-center h-full'>
        {Array.from({ length: 5 }).map((_, index) => (
          <section
            key={index}
            className='h-[calc(100%-10%)] w-full flex flex-col gap-2'
          >
            <div className='h-3/4'>
              <Skeleton className='h-20 w-full rounded-xl' />
            </div>
            <div className='flex flex-col gap-2 h-1/4'>
              <Skeleton className='h-4 w-1/2 rounded-xl' />
              <Skeleton className='h-4 w-full rounded-xl' />
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <main>
      {isLoading ? (
        <div className='flex items-center flex-col gap-4 justify-center h-full'>
          {Array.from({ length: 5 }).map((_, index) => (
            <section
              key={index}
              className='h-[calc(100%-10%)] w-full flex flex-col gap-2'
            >
              <div className='h-3/4'>
                <Skeleton className='h-20 w-full rounded-xl' />
              </div>
              <div className='flex flex-col gap-2 h-1/4'>
                <Skeleton className='h-4 w-1/2 rounded-xl' />
                <Skeleton className='h-4 w-full rounded-xl' />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Card className='p-4 flex flex-col gap-4 h-full overflow-y-auto'>
          <CardHeader>
            <div className='flex items-center flex-col md:flex-row  gap-4 justify-between'>
              <p className='text-base font-semibold flex items-center gap-2'>
                Community Discussions
                <span className='text-sm md:text-base'>
                  ({threads?.length || 0})
                </span>
              </p>
              <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
                <Button
                  variant='outline'
                  className='text-xs md:text-sm w-full md:w-auto'
                  onClick={handleCreateThread}
                >
                  <Plus />
                  Start Discussion
                </Button>
                <Button
                  className='text-xs md:text-sm w-full md:w-auto'
                  onClick={handleViewAllDiscussions}
                >
                  View All Discussion
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='flex flex-col gap-4 h-full p-0 md:p-4'>
            {threads?.length === 0 ? (
              <p className='text-xs md:text-sm text-center text-muted-foreground'>
                No discussions yet. Be the first to share your thoughts!
              </p>
            ) : (
              <ThreadsCard thread={threads || []} />
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export default ProtocolThreadList;
