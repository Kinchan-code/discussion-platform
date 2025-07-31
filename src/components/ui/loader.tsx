import { LoaderIcon } from 'lucide-react';

/**
 * Loader component
 * @description This component is used to display the loader for the current page.
 *
 * components used:
 * - LoaderIcon: The component to render the loader.
 *
 * @returns {JSX.Element} The loader component.
 *
 * @example
 * <Loader />
 */

function Loader() {
  return (
    <main className='flex h-screen items-center justify-center'>
      <LoaderIcon className='size-5 md:size-10 animate-spin' />
    </main>
  );
}

export { Loader };
