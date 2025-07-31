import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Command Palette Components
 *
 * @description
 * A composable set of UI primitives for building a command palette interface using `cmdk` and Radix UI’s Dialog.
 * This includes a modal `CommandDialog` wrapper with input, list, grouping, and shortcut support.
 * Suitable for searchable command menus, global action palettes, or contextual command triggers.
 *
 * components used:
 * - CommandPrimitive from `cmdk`
 * - Dialog, DialogContent, DialogTitle, DialogDescription (from `@/components/ui/dialog`)
 * - SearchIcon from `lucide-react`
 * - cn utility from `@/lib/utils`
 *
 * @param className - Tailwind utility classes passed to override or extend default styles.
 * @param children - React children nodes to be rendered inside command primitives.
 * @param props - Native props from each component's underlying DOM element or primitive.
 * @param title - (optional) Title for the `CommandDialog`, hidden visually but used for accessibility.
 * @param description - (optional) Description for the `CommandDialog`, also visually hidden.
 * @param showCloseButton - (optional) Controls whether to render the close button on the dialog.
 *
 * @returns
 * - CommandDialog: A modal container for command input and results.
 * - Command: Wrapper for the command system layout.
 * - CommandInput: Search input field with icon.
 * - CommandList: Scrollable list container.
 * - CommandEmpty: Fallback when no items match.
 * - CommandGroup: Grouping component with headings.
 * - CommandItem: Individual actionable item.
 * - CommandShortcut: Right-aligned shortcut hint.
 * - CommandSeparator: Horizontal separator between groups or sections.
 *
 * @error N/A
 *
 * @example
 * <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem>Dashboard</CommandItem>
 *       <CommandItem>Settings</CommandItem>
 *     </CommandGroup>
 *     <CommandSeparator />
 *     <CommandGroup heading="Actions">
 *       <CommandItem>
 *         <span>New Project</span>
 *         <CommandShortcut>⌘N</CommandShortcut>
 *       </CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 */

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
        className
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className='sr-only'>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className='[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot='command-input-wrapper'
      className='flex h-9 items-center gap-2 border-b px-3'
    >
      <SearchIcon className='size-4 shrink-0 opacity-50' />
      <CommandPrimitive.Input
        data-slot='command-input'
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot='command-empty'
      className='py-6 text-center text-sm'
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn(
        'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot='command-separator'
      className={cn('bg-border -mx-1 h-px', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='command-shortcut'
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
