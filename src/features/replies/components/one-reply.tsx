import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2, Reply as ReplyIcon } from "lucide-react";

import GoBackButton from "@/components/go-back-button";
import { slugify } from "@/lib/utils";
import { ReplyItem } from "@/components/replies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button/button";
import { useGetOneReply } from "@/api/replies/one-reply";
import useReplyStore from "@/store/reply-store";
import type { Reply } from "@/types/replies";
import type { Threads } from "@/types/threads";

interface ReplyWithContext extends Reply {
  comment_id?: number;
  thread_id?: number;
  thread?: Threads;
}

/**
 * OneReply Component
 *
 * @description Displays a single reply with its nested replies and a link to navigate to the thread.
 *
 * components used:
 * - GoBackButton: A button to navigate back to the previous page.
 * - ReplyItem: Displays the reply with voting, editing, and nested reply functionality.
 * - Card: Container for the reply display.
 * - Button: Link button to navigate to the thread.
 *
 * @returns {JSX.Element} The OneReply component.
 * @example
 * <OneReply />
 */

function OneReply() {
  const { replyId } = useParams();
  const navigate = useNavigate();
  const { setShowRepliesReply } = useReplyStore();

  const {
    data: replyData,
    isLoading: isLoadingReply,
    isError: isReplyError,
    error: replyError,
  } = useGetOneReply(replyId || "");

  const reply = replyData?.data as ReplyWithContext | undefined;
  const { isShowRepliesReplyActive } = useReplyStore();

  // Automatically show nested replies when reply is loaded
  useEffect(() => {
    if (reply && replyId && !isShowRepliesReplyActive(replyId)) {
      setShowRepliesReply(replyId);
    }
  }, [reply, replyId, setShowRepliesReply, isShowRepliesReplyActive]);

  if (isLoadingReply) {
    return (
      <main className="flex flex-col gap-4 h-full">
        <section>
          <GoBackButton />
        </section>
        <section>
          <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-36 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isReplyError || !reply) {
    return (
      <main className="flex flex-col gap-4 h-full">
        <section>
          <GoBackButton />
        </section>
        <section>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                <ReplyIcon className="size-8 md:size-10" />
                <p className="text-xs md:text-sm">
                  {replyError instanceof Error
                    ? replyError.message
                    : "Failed to load reply. Please try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // Get comment_id from reply - it might be in the API response even if not in the base type
  const commentId =
    reply?.comment_id?.toString() ||
    reply?.replying_to?.id?.toString() ||
    reply.id.toString();

  return (
    <main className="flex flex-col gap-4 h-full">
      <section>
        <GoBackButton />
      </section>
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <ReplyIcon className="size-3 md:size-4" />
                <p className="text-base md:text-lg">Reply</p>
              </CardTitle>
              {reply.thread_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/threads/${reply.thread_id}/${slugify(
                        reply.thread?.title || ""
                      )}`
                    )
                  }
                  className="text-xs md:text-sm"
                >
                  <Link2 className="size-3 md:size-4 mr-1" />
                  View Thread
                </Button>
              )}
            </div>
            {reply.thread?.title && (
              <p className="text-xs md:text-sm text-muted-foreground">
                Discussion: {reply.thread.title}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ReplyItem
              reply={reply}
              commentId={commentId}
              margin={false}
              depth={1}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default OneReply;
