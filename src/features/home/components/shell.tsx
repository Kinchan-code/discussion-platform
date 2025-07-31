import { Outlet } from 'react-router-dom';

import Header from '@/features/home/components/header';

/**
 * App Shell Component
 * @description App Shell
 *
 * components used
 * - Header
 * - Outlet
 *
 * @returns {JSX.Element} The App Shell component.
 * @example
 * <AppShell />
 */

function AppShell() {
  return (
    <main className='flex flex-col h-screen w-full'>
      <header className='sticky top-0 z-10 border bg-white overflow-hidden'>
        <Header />
      </header>
      <section
        id='main-section'
        className='flex-1 overflow-y-auto w-full bg-[#f9fafb]'
      >
        <div className='max-w-7xl mx-auto p-4'>
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AppShell;
