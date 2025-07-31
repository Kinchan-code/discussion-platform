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
import { Textarea } from '@/components/ui/textarea';

/**
 * FormTextArea
 *
 * @description A reusable text area form component integrated with React Hook Form.
 *
 * components used:
 *   - FormField
 *   - FormItem
 *   - FormLabel
 *   - FormControl
 *   - FormMessage
 *   - Textarea
 *
 * @param name - The name of the form field, used for form state binding.
 * @param label - Optional label displayed above the text area.
 * @param placeholder - Optional placeholder text inside the text area.
 * @param readonly - Optional flag to make the field read-only.
 * @param className - Optional Tailwind classes to customize the text area.
 *
 * @returns A controlled <textarea> component compatible with React Hook Form.
 *
 * @example
 * <FormTextArea
 *   name="description"
 *   label="Description"
 *   placeholder="Enter details..."
 * />
 */

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  label?: string;
  placeholder?: string;
  readonly?: boolean; // Optional prop to make the textarea read-only
  className?: string;
}

function FormTextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  placeholder = 'Enter Placeholder...',
  readonly,
  className,
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
            <Textarea
              id={name}
              placeholder={placeholder}
              className={cn('h-20 md:h-40 text-xs md:text-sm', className)}
              readOnly={readonly || field.disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormTextArea };
