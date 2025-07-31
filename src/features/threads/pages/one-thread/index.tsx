import { useParams } from 'react-router-dom';

import GoBackButton from '@/components/go-back-button';
import ThreadDetail from '@/features/threads/pages/one-thread/components/thread-detail';

import { CommentSection } from '@/features/threads/pages/one-thread/components/comment-section';

/**
 * OneThread Component
 *
 * @description This component renders the details of a single thread, including its comments and replies.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - ThreadDetail: Displays detailed information about the thread.
 * - CommentSection: Displays comments and allows users to add new comments.
 *
 * @returns {JSX.Element} The OneThread component.
 *
 * @example
 * <OneThread />
 */

function OneThread() {
  const { threadId } = useParams();
  return (
    <main className='flex flex-col gap-4 h-full'>
      <section>
        <GoBackButton />
      </section>
      <section>
        <ThreadDetail />
      </section>
      <section>
        <CommentSection threadId={threadId || ''} />
      </section>
    </main>
  );
}

export default OneThread;
