import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Search Input Component
 * @description Search Input
 *
 * components used
 * - Input
 * - SearchIcon
 *
 * @param {object} props - The props for the search input.
 * @param {string} props.placeholder - The placeholder for the search input.
 * @param {string} props.className - The class name for the search input.
 *
 * @returns {JSX.Element} The Search Input component.
 * @example
 * <SearchInput placeholder="Search..." />
 */

function SearchInput({
  placeholder = 'Search...',
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      type='text'
      placeholder={placeholder}
      leftSection={<SearchIcon className='size-4 text-muted-foreground' />}
      className={cn('w-full text-xs md:text-base', props.className)}
      {...props}
    />
  );
}

export { SearchInput };
