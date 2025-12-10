import { Clock, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { slugify } from "@/lib/utils";

import { Badge } from "@/components/ui/badge/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Threads } from "@/types/threads";

/**
 * TrendingDiscussionsCard Component
 * @description Displays a card with trending discussions.
 *
 * components used:
 * - Card
 * - CardHeader
 * - CardContent
 * - CardTitle
 * - Badge
 *
 * @param {Object} props - The properties for the TrendingDiscussionsCard component.
 * @param {Threads[]} props.threads - The threads data to display.
 * @param {boolean} [props.isFetching=false] - Whether the data is being fetched.
 *
 * @returns {JSX.Element} The TrendingDiscussionsCard component.
 */

interface TrendingDiscussionsCardProps {
  threads: Threads[];
  isFetching?: boolean;
}

function TrendingDiscussionContentHeader({ thread }: { thread: Threads }) {
  return (
    <header>
      <Link to={`/threads/${thread.id}/${slugify(thread.title)}`}>
        <h4 className="font-medium text-sm hover:text-blue-600 transition-colors leading-tight">
          {thread.title}
        </h4>
      </Link>
    </header>
  );
}

function TrendingDiscussionProtocolBadge({ thread }: { thread: Threads }) {
  return (
    <Badge variant="outline" className="text-xs break-words">
      {thread.protocol.title}
    </Badge>
  );
}

function TrendingDiscussionAuthorAndTime({ thread }: { thread: Threads }) {
  return (
    <section className="flex items-center justify-between text-xs text-gray-600">
      <span>by {thread.author}</span>
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {new Date(thread.created_at).toLocaleDateString()}
      </div>
    </section>
  );
}

function TrendingDiscussionRepliesAndUpvotes({ thread }: { thread: Threads }) {
  return (
    <section className="flex items-center gap-3 text-xs text-gray-600">
      <div className="flex items-center gap-1">
        <MessageSquare className="w-3 h-3" />
        {thread.comments_count} comments
      </div>
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {thread.upvotes}
      </div>
    </section>
  );
}

function TrendingDiscussionsCard({ threads }: TrendingDiscussionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Trending Discussions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {threads.map((thread) => (
          <main
            key={thread.id}
            className="border-b-2 border-gray-100 last:border-b-0 flex flex-col gap-2 pb-4"
          >
            <TrendingDiscussionContentHeader thread={thread} />
            <section className="flex flex-col gap-2 pt-2">
              <TrendingDiscussionProtocolBadge thread={thread} />
              <TrendingDiscussionAuthorAndTime thread={thread} />
              <TrendingDiscussionRepliesAndUpvotes thread={thread} />
            </section>
          </main>
        ))}
      </CardContent>
    </Card>
  );
}

export { TrendingDiscussionsCard };
