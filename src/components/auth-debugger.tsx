import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';

/**
 * AuthDebugger Component
 *
 * @description Displays authentication debug information including:
 * - Current authentication status
 * - User email
 * - Token from store and localStorage
 * - Sync status of tokens
 *
 * @param {React.ReactNode} children - React nodes to render inside the component.
 *
 *
 * @returns AuthDebugger component
 */

function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<{
    storeToken: string | null;
    localStorageToken: string | null;
    isInSync: boolean;
  } | null>(null);
  const debugTokenStatus = useAuthStore((state) => state.debugTokenStatus);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo(debugTokenStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [debugTokenStatus]);

  return (
    <div className='fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm'>
      <h3 className='font-bold mb-2'>Auth Debug Info</h3>
      <div className='space-y-1'>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user?.email || 'None'}</div>
        <div>
          Store Token: {token ? `${token.substring(0, 10)}...` : 'None'}
        </div>
        {debugInfo && (
          <>
            <div>
              LocalStorage Token:{' '}
              {debugInfo.localStorageToken
                ? `${debugInfo.localStorageToken.substring(0, 10)}...`
                : 'None'}
            </div>
            <div>Tokens In Sync: {debugInfo.isInSync ? '✅' : '❌'}</div>
          </>
        )}
      </div>
    </div>
  );
}

export { AuthDebugger };
