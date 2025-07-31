import { Button } from '@/components/ui/button/button';
import { LoaderIcon } from 'lucide-react';

/**
 * LoadMoreButton Component
 *
 * @description
 * A utility button component for pagination scenarios, typically used to load the next page of data.
 * It shows different states based on loading and pagination status: loading spinner, "No more data" message, or the actual button.
 *
 * components used:
 * - Button (custom UI component)
 * - LoaderIcon (from lucide-react)
 *
 * @param onClick - Function to trigger data fetching for the next page.
 * @param isLoading - Optional. Whether the initial data is still loading.
 * @param hasNextPage - Boolean indicating if more pages are available.
 * @param isFetchingNextPage - Boolean showing if a new page is being fetched.
 * @param className - Optional Tailwind CSS classes for styling the button.
 *
 * @returns Conditional UI: a loader icon, an informative message, or a clickable "Load More" button.
 *
 * @example
 * ```tsx
 * <LoadMoreButton
 *   onClick={() => fetchNextPage()}
 *   isLoading={isInitialLoading}
 *   hasNextPage={hasNextPage}
 *   isFetchingNextPage={isFetchingNextPage}
 * />
 * ```
 */

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  className?: string;
}

export function LoadMoreButton({
  onClick,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  className,
}: LoadMoreButtonProps) {
  if (isLoading) {
    return (
      <div className='flex justify-center py-4'>
        <LoaderIcon className='size-4 md:size-5 animate-spin' />
      </div>
    );
  }

  if (!hasNextPage) {
    return (
      <p className='text-center italic text-xs md:text-sm text-muted-foreground font-medium'>
        No more data
      </p>
    );
  }

  return (
    <div className='flex justify-center py-4'>
      <Button
        onClick={onClick}
        disabled={isFetchingNextPage}
        variant='ghost'
        className={className}
      >
        {isFetchingNextPage ? (
          <div className='flex items-center gap-2'>
            <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />
            <p className='text-xs md:text-sm text-muted-foreground font-medium'>
              Loading more...
            </p>
          </div>
        ) : (
          <p className='text-xs text-center md:text-sm text-muted-foreground font-medium'>
            Load More
          </p>
        )}
      </Button>
    </div>
  );
}
