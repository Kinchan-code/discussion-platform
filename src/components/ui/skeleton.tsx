import { cn } from '@/lib/utils';

/**
 * Skeleton Component
 * @description
 * A simple skeleton loader component that can be used to indicate loading states.
 * It applies a background color and animation to simulate content loading.
 *
 * components used:
 * - div (styled with Tailwind CSS)
 *
 * @param className - Optional Tailwind CSS classes for custom styling.
 * @returns A div element styled as a skeleton loader.
 * @example
 * <Skeleton className="h-4 w-full" />
 */

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
