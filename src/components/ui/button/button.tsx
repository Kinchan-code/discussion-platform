import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button/button-variants";

/**
 * Button component
 * @description This component is used to create a button.
 *
 * Components used:
 * - Slot: The component to render the button.
 * - cn: The component to merge the button variants.
 *
 * Variants:
 * - variant: The variant of the button.
 * - size: The size of the button.
 *
 * @param {React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>} props The props for the button.
 * @param {string} props.className The class name for the button.
 * @param {VariantProps<typeof buttonVariants>["variant"]} props.variant The variant of the button.
 * @param {VariantProps<typeof buttonVariants>["size"]} props.size The size of the button.
 * @param {boolean} props.asChild Whether the button is a child of the parent component.
 *
 * @returns {JSX.Element} The button component.
 *
 * @example
 * <Button>Click me</Button>
 * <Button variant='outline'>Click me</Button>
 * <Button size='sm'>Click me</Button>
 * <Button asChild>Click me</Button>
 */

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
