import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { badgeVariants } from '@/components/ui/badge/badge-variants';

/**
 * Badge
 *
 * @description A flexible badge component styled with Tailwind and CVA variants.
 * Can be rendered as a native element or inherit a parent element using `Slot`.
 *
 * components used:
 * - Slot (Radix UI)
 * - badgeVariants (CVA)
 * - cn (utility for className merging)
 *
 * @param {React.ComponentProps<'span'>} props - Native span props.
 * @param {keyof typeof badgeVariants.variants.variant} [variant] - Badge style variant.
 * @param {string} [className] - Additional custom class names.
 * @param {boolean} [asChild=false] - If true, renders as child using Radix Slot.
 *
 * @returns {JSX.Element} A styled badge component.
 *
 * @example
 * <Badge variant="destructive">Error</Badge>
 *
 * @example
 * <Badge asChild>
 *   <a href="/profile">Profile</a>
 * </Badge>
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
