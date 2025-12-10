import GoBackButton from "@/components/go-back-button";
import { CommentSection } from "@/components/comments";
import ThreadDetail from "@/features/threads/pages/one-thread/components/thread-detail";

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
  return (
    <main className="flex flex-col gap-4 h-full">
      <section>
        <GoBackButton />
      </section>
      <section>
        <ThreadDetail />
      </section>
      <section>
        <CommentSection />
      </section>
    </main>
  );
}

export default OneThread;
