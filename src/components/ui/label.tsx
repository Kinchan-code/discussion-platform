'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

/**
 * Label Component
 *
 * @description
 * A wrapper around Radix UI's `LabelPrimitive.Root`, providing consistent styling for form labels.
 * It supports disabled states and integrates smoothly with form fields using utility classes.
 *
 * components used:
 * - @radix-ui/react-label: LabelPrimitive.Root
 * - cn utility (for className merging)
 *
 * @param className - Optional Tailwind CSS classes for customizing the label.
 * @param ...props - Inherits all props from `LabelPrimitive.Root`.
 *
 * @returns A styled label element with accessibility and disabled state handling.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * ```
 */

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot='label'
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
