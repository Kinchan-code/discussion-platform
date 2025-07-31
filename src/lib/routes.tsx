import { createBrowserRouter } from 'react-router-dom';

import { Loader } from '@/components/ui/loader';
import {
  AllProtocols,
  AllThreads,
  CreateProtocol,
  CreateThread,
  Dashboard,
  EditProtocol,
  EditThread,
  Home,
  Login,
  NotFound,
  OneProtocol,
  OneThread,
  Profile,
  Protocols,
  Register,
  Threads,
  UserComments,
  UserProtocols,
  UserReplies,
  UserReviews,
  UserThreads,
} from '@/lib/lazy';

/**
 * Routes Configuration
 *
 * @description This file defines the routes for the application using React Router.
 *
 * @param {Array} routes - An array of route objects defining the application's navigation structure.
 *
 * @returns {BrowserRouter} A configured browser router with the defined routes.
 * @example
 * import { routes } from '@/lib/routes';
 * const router = createBrowserRouter(routes);
 * export default router;
 */

export const routes = createBrowserRouter(
  [
    {
      id: 'login',
      path: '/login',
      element: <Login />,
    },
    {
      id: 'register',
      path: '/register',
      element: <Register />,
    },
    {
      id: 'root',
      path: '/',
      element: <Home />,
      children: [
        {
          id: 'dashboard',
          index: true,
          element: <Dashboard />,
        },
        {
          id: 'profile',
          path: '/profile',
          element: <Profile />,
          children: [
            {
              id: 'user-protocols',
              path: 'protocols',
              element: <UserProtocols />,
            },
            {
              id: 'user-threads',
              path: 'threads',
              element: <UserThreads />,
            },
            {
              id: 'user-replies',
              path: 'replies',
              element: <UserReplies />,
            },
            {
              id: 'user-comments',
              path: 'comments',
              element: <UserComments />,
            },
            {
              id: 'user-reviews',
              path: 'reviews',
              element: <UserReviews />,
            },
          ],
        },
        {
          id: 'protocols',
          path: 'protocols',
          element: <Protocols />,
          children: [
            {
              id: 'create-protocol',
              path: 'create',
              element: <CreateProtocol />,
            },
            {
              id: 'edit-protocol',
              path: ':protocolId/edit',
              element: <EditProtocol />,
            },
            {
              id: 'all-protocols',
              index: true,
              element: <AllProtocols />,
            },
            {
              id: 'one-protocol',
              path: ':protocolId',
              element: <OneProtocol />,
            },
          ],
        },
        {
          id: 'threads',
          path: 'threads',
          element: <Threads />,
          children: [
            {
              id: 'create-thread',
              path: 'create',
              element: <CreateThread />,
            },
            {
              id: 'edit-thread',
              path: ':threadId/edit',
              element: <EditThread />,
            },
            {
              id: 'all-threads',
              index: true,
              element: <AllThreads />,
            },
            {
              id: 'one-thread',
              path: ':threadId',
              element: <OneThread />,
            },
          ],
        },
      ],
    },
    {
      id: 'not-found',
      path: '*',
      element: <NotFound />,
    },
  ],
  {
    hydrationData: {
      loaderData: {
        root: <Loader />,
      },
    },
  }
);
