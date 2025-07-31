import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelectInputStore } from '@/store/select-input-store';

/**
 * SortByInput Component
 *
 * @description A dropdown input for selecting sorting options.
 * components used:
 * - Select
 * - SelectContent
 * - SelectGroup
 * - SelectItem
 * - SelectLabel
 * - SelectSeparator
 * - SelectTrigger
 * - SelectValue
 *
 * @param {object} props - The props for the SortByInput component.
 * @param {string} props.className - The class name for the SortByInput component
 * @param {string} props.placeholder - The placeholder for the SortByInput component.
 * @param {string} props.value - The value of the SortByInput component.
 * @param {function} props.onChange - The function to be called when the value changes.
 * @param {string} props.id - The id for the SortByInput component.
 * @param {string} props.label - The label for the SortByInput component.
 *
 * @returns {JSX.Element} The SortByInput component.
 *
 * @example
 * <SortByInput />
 */

interface SortByOption {
  value: string;
  label: string;
}

const sortByOptions: SortByOption[] = [
  { value: 'recent', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'upvotes', label: 'Votes' },
];

function SortByInput() {
  const { sortBy, setSortBy } = useSelectInputStore();

  return (
    <main className='flex items-center gap-2 w-full md:w-auto'>
      <Label
        htmlFor='sort-by-input'
        className='text-xs md:text-sm'
      >
        Sort by:
      </Label>
      <Select
        value={sortBy}
        onValueChange={setSortBy}
      >
        <SelectTrigger
          id='sort-by-input'
          className='text-xs md:text-sm'
        >
          <SelectValue placeholder='Select a sort option' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectSeparator />

            {sortByOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </main>
  );
}

export { SortByInput };
