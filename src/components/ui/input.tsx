import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';

/**
 * Input Component
 *
 * @description
 * A custom input component with optional left and right sections, styled with Tailwind CSS.
 * It supports toggling password visibility using eye icons and integrates well with form layouts.
 *
 * components used:
 * - lucide-react: Eye, EyeClosed (for password toggle)
 * - cn utility (for className merging)
 *
 * @param type - The input type (e.g., "text", "password"). Toggles between "password" and "text" if password.
 * @param className - Optional Tailwind CSS classes for customizing the input.
 * @param leftSection - Optional element rendered before the input field (e.g., icon or label).
 * @param rightSection - Optional element rendered after the input field, shown if not a password input.
 * @param ...props - Inherits all native HTML input props.
 *
 * @returns A styled input element wrapped in a flex container with optional adornments.
 *
 * @example
 * ```tsx
 * <Input
 *   type="password"
 *   placeholder="Enter your password"
 *   leftSection={<LockIcon />}
 * />
 * ```
 */

interface InputProps extends React.ComponentProps<'input'> {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

function Input({
  className,
  type,
  leftSection,
  rightSection,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState<string>(
    type || 'text'
  );
  const handleShowPassword = () => {
    // Logic to toggle password visibility
    if (showPassword === 'password') {
      setShowPassword('text');
    } else {
      setShowPassword('password');
    }
  };
  return (
    <main
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-1 h-10 bg-white',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
      )}
    >
      {leftSection}
      <input
        type={showPassword ? showPassword : type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:outline-none',
          className
        )}
        {...props}
      />
      {type === 'password' ? (
        <div
          className='cursor-pointer text-muted-foreground'
          onClick={handleShowPassword}
        >
          {showPassword === 'password' ? (
            <EyeClosed className='size-3 md:size-4' />
          ) : (
            <Eye className='size-3 md:size-4' />
          )}
        </div>
      ) : (
        rightSection
      )}
    </main>
  );
}

export { Input };
