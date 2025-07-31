import { Loader, LockIcon, MailIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '@/features/login/api/auth';
import {
  loginSchema,
  type LoginSchemaType,
} from '@/features/login/schema/login-schema';

import type z from 'zod';

/**
 * LoginForm Component
 * @description Form for user login
 *
 * components used:
 * - Form
 * - FormInput
 * - Button
 *
 * @returns {JSX.Element} The LoginForm component.
 */

function LoginForm() {
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = (values: LoginSchemaType) => {
    const loginPromise = login(values);

    toast.promise(loginPromise, {
      loading: 'Logging in...',
      success: 'Login successful!',
      error: 'Login failed. Please try again.',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-col gap-4 w-full'
      >
        {/* Email Field */}
        <FormInput
          label='Email'
          name='email'
          className='text-xs md:text-sm'
          placeholder='Enter your email'
          leftSection={
            <MailIcon className='size-3 md:size-4 text-muted-foreground' />
          }
        />

        {/* Password Field */}

        <FormInput
          label='Password'
          name='password'
          type='password'
          className='text-xs md:text-sm'
          placeholder='Enter your password'
          leftSection={
            <LockIcon className='size-3 md:size-4 text-muted-foreground' />
          }
        />

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full text-xs md:text-sm'
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <div className='flex items-center gap-2'>
              <Loader className='animate-spin' /> Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
