import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

/**
 * Separator Component
 *
 * @description
 * A simple separator component that can be used to visually divide content.
 * It supports both horizontal and vertical orientations and can be styled with Tailwind CSS classes.
 *
 * components used:
 * - @radix-ui/react-separator
 *
 * @param className - Optional Tailwind CSS classes for custom styling.
 * @param orientation - Orientation of the separator, either "horizontal" or "vertical".
 * @param decorative - Whether the separator is purely decorative (default: true).
 *
 * @returns A styled separator element.
 * @example
 * <Separator className="my-4" orientation="horizontal" />
 */

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
