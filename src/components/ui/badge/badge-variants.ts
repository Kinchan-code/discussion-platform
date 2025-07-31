import { cva } from 'class-variance-authority';

/**
 * badgeVariants
 *
 * @description A utility using `class-variance-authority` (CVA) to define reusable Tailwind CSS class variants for badges.
 *
 * components used:
 * - cva (class-variance-authority)
 *
 * @param {Object} options - Configuration for variants.
 * @param {'default' | 'secondary' | 'destructive' | 'outline'} options.variant - The style variant of the badge.
 *
 * @returns {string} A string of composed class names based on the selected variant.
 *
 * @example
 * <span className={badgeVariants({ variant: 'destructive' })}>Warning</span>
 */
export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
