import { lazy } from "react";

/**
 * Lazy-loaded routes for the application.
 *
 * @description This file contains lazy-loaded components for different routes in the application.
 * It allows for code-splitting and improves performance by loading components only when needed.
 *
 * @returns {Object} An object containing lazy-loaded components.
 *
 * @example
 * import { Home, Login } from '@/routes';
 */

// Authentication
export const Login = lazy(() => import("@/routes/login"));
export const Register = lazy(() => import("@/routes/register"));

// Not Found
export const NotFound = lazy(() => import("@/components/not-found"));

// Profile
export const Profile = lazy(() => import("@/routes/profile"));
// Profile -> Protocols
export const UserProtocols = lazy(
  () => import("@/features/profile/pages/protocols")
);
// Profile -> Threads
export const UserThreads = lazy(
  () => import("@/features/profile/pages/threads")
);
// Profile -> Replies
export const UserReplies = lazy(
  () => import("@/features/profile/pages/replies")
);
// Profile -> Comments
export const UserComments = lazy(
  () => import("@/features/profile/pages/comments")
);
// Profile -> Reviews
export const UserReviews = lazy(
  () => import("@/features/profile/pages/reviews")
);

// Main
export const Home = lazy(() => import("@/routes/home"));

// Dashboard
export const Dashboard = lazy(
  () => import("@/features/home/components/dashboard")
);

// Protocols
export const Protocols = lazy(() => import("@/routes/protocols"));
// Protocols -> Create Protocol
export const CreateProtocol = lazy(
  () => import("@/features/protocols/pages/create-protocol")
);
// Protocols -> Edit Protocol
export const EditProtocol = lazy(
  () => import("@/features/protocols/pages/edit-protocol/index")
);
// Protocols -> All Protocols
export const AllProtocols = lazy(
  () => import("@/features/protocols/pages/protocols")
);
// Protocols -> One Protocol
export const OneProtocol = lazy(
  () => import("@/features/protocols/pages/one-protocol")
);

// Threads
export const Threads = lazy(() => import("@/routes/threads"));
// Threads -> Create Thread
export const CreateThread = lazy(
  () => import("@/features/threads/pages/create-thread")
);
// Threads -> Edit Thread
export const EditThread = lazy(
  () => import("@/features/threads/pages/edit-thread")
);
// Threads -> All Threads
export const AllThreads = lazy(
  () => import("@/features/threads/pages/threads")
);
// Threads -> One Thread
export const OneThread = lazy(
  () => import("@/features/threads/pages/one-thread")
);

// Comments
export const Comments = lazy(() => import("@/routes/comment"));

// Replies
export const Replies = lazy(() => import("@/routes/reply"));
