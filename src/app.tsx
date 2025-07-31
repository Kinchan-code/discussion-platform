import { Loader } from '@/components/ui/loader';
import { routes } from '@/lib/routes';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthInitializer } from '@/components/auth-initializer';
import { Toaster } from 'sonner';

/**
 * App Component
 *
 * @description Main application component that initializes authentication and sets up routing.
 *
 * components used:
 * - AuthInitializer: Initializes authentication state.
 * - RouterProvider: Provides routing capabilities.
 * - Suspense: Handles loading states for asynchronous components.
 * - Loader: Displays a loading spinner while routes are being resolved.
 * - Toaster: Displays toast notifications.
 *
 * @returns {JSX.Element} The main App component.
 * @example
 * <App />
 */

function App() {
  return (
    <AuthInitializer>
      <Suspense
        fallback={
          <main className='h-screen'>
            <Loader />
          </main>
        }
      >
        <RouterProvider router={routes} />
        <Toaster />
      </Suspense>
    </AuthInitializer>
  );
}

export default App;
