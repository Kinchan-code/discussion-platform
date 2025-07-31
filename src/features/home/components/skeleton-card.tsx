import { Skeleton } from '@/components/ui/skeleton';

/**
 * SkeletonCard Component
 * @description Displays a skeleton card for loading states.
 *
 * components used:
 * - Skeleton
 *
 * @returns {JSX.Element} The SkeletonCard component.
 * @example
 * <SkeletonCard />
 */

function SkeletonCard() {
  return (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='h-40 w-full rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
    </div>
  );
}

export { SkeletonCard };
