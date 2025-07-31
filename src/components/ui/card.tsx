import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Card Components
 *
 * @description
 * A composable UI card component system consisting of `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, and `CardContent`.
 * These components follow a flexible layout for building consistent card-based UIs with titles, actions, descriptions, and content areas.
 *
 * components used:
 * - cn (utility function from @/lib/utils)
 *
 * @param className - Additional Tailwind classes to extend or override default styles.
 * @param props - Native `div` element props passed to each component.
 * @returns JSX.Element - A collection of styled card layout primitives.
 * @throws N/A
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Project Alpha</CardTitle>
 *     <CardAction>
 *       <Button variant="outline">View</Button>
 *     </CardAction>
 *   </CardHeader>
 *   <CardContent>
 *     <p>This is a short description of the project.</p>
 *   </CardContent>
 *   <CardFooter>
 *     <span>Last updated: Today</span>
 *   </CardFooter>
 * </Card>
 */

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
