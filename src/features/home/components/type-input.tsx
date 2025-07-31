import { useState } from 'react';

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

/**
 * TypeInput Component
 * @description Dropdown for selecting content type (all, protocols, threads).
 *
 * components used:
 * - Label
 * - Select
 * - SelectContent
 * - SelectGroup
 * - SelectItem
 * - SelectLabel
 * - SelectSeparator
 * - SelectTrigger
 * - SelectValue
 *
 * @param {Object} props - The properties for the TypeInput component.
 * @param {string} props.value - The current selected value.
 * @param {function} props.onChange - The function to call when the value changes.
 *
 * @returns {JSX.Element} The TypeInput component.
 *
 * @example
 * <TypeInput value="all" onChange={(value) => console.log(value)} />
 */

interface TypeOption {
  value: string;
  label: string;
}

const typeOptions: TypeOption[] = [
  { value: 'all', label: 'All' },
  { value: 'protocols', label: 'Protocols' },
  { value: 'threads', label: 'Threads' },
];

function TypeInput() {
  const [type, setType] = useState(typeOptions[0].value);

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  return (
    <main className='flex items-center gap-2 w-full md:w-auto'>
      <Label
        htmlFor='type-input'
        className='text-xs md:text-sm'
      >
        Type:
      </Label>
      <Select
        value={type}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger
          id='type-input'
          className='text-xs md:text-sm'
        >
          <SelectValue placeholder='Select type' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            <SelectSeparator />
            {typeOptions.map((option) => (
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

export { TypeInput };
