import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

/**
 * Renders a controlled input field integrated with `react-hook-form`, supporting validation and styling.
 *
 * @description
 * A reusable form input component that works with `useFormContext`. Supports custom labels, input types,
 * placeholder text, optional left section (e.g., icons), and responsive styling via Tailwind CSS.
 *
 * components used:
 * - FormField
 * - FormItem
 * - FormLabel
 * - FormControl
 * - FormMessage
 * - Input
 *
 * @param name - The field name to register in the form.
 * @param label - Optional label text shown above the input.
 * @param type - Input type (default: 'text').
 * @param placeholder - Placeholder text for the input (default: "Enter Placeholder...").
 * @param className - Additional class names to apply to the input.
 * @param leftSection - Optional node rendered inside the input (e.g., icon).
 *
 * @returns A JSX element containing a fully controlled input with label and validation message.
 *
 * @example
 * <FormInput name="email" label="Email" type="email" placeholder="Enter your email" />
 */

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  className?: string;
  leftSection?: React.ReactNode;
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  type = 'text',
  placeholder = 'Enter Placeholder...',
  className,
  leftSection,
}: FormInputProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className='text-xs md:text-sm'
            htmlFor={name}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              leftSection={leftSection}
              className={cn('w-full text-xs md:text-base', className)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInput };
