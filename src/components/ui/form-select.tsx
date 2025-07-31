import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

/**
 * FormSelect
 *
 * @description A reusable select dropdown component integrated with React Hook Form.
 *
 * components used:
 * - Select (shadcn/ui)
 * - FormField, FormControl, FormItem, FormMessage (shadcn/ui form)
 *
 * @param name - The name of the form field.
 * @param placeholder - Placeholder text shown in the select input.
 * @param className - Optional Tailwind CSS class overrides.
 * @param options - Array of selectable options with label and value.
 * @param disabled - Disables the select input if true.
 *
 * @returns JSX.Element
 *
 * @example
 * <FormSelect
 *   name="country"
 *   options={[{ label: 'Philippines', value: 'ph' }, { label: 'Japan', value: 'jp' }]}
 * />
 */

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  placeholder?: string;
  className?: string;
  options: SelectOption[];
  disabled?: boolean;
}

function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  placeholder = 'Select an option...',
  className,
  options,
  disabled = false,
}: FormSelectProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn('w-full text-xs md:text-base', className)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormSelect };
