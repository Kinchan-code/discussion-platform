import { LockIcon, LockKeyholeIcon, MailIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegister } from "../../../api/auth/register";
import {
  registerSchema,
  type RegisterSchemaType,
} from "@/features/register/schema/register-schema";

/**
 * RegisterForm Component
 * @description Form for user registration.
 *
 * components used:
 * - Form
 * - FormInput
 * - Button
 * - UserIcon (icon)
 * - MailIcon (icon)
 * - LockIcon (icon)
 * - LockKeyholeIcon (icon)
 *
 * @returns {JSX.Element} The RegisterForm component.
 * @example
 * <RegisterForm />
 */

function RegisterForm() {
  const { mutateAsync: register } = useRegister();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = (values: RegisterSchemaType) => {
    const registerPromise = register(values);

    toast.promise(registerPromise, {
      loading: "Registering...",
      success: "Registration successful!",
      error: "Registration failed. Please try again.",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {/* Name Field */}

        <FormInput
          name="name"
          label="Name"
          className="text-xs md:text-sm"
          placeholder="Enter your name"
          leftSection={
            <UserIcon className="size-3 md:size-4 text-muted-foreground" />
          }
        />
        {/* Email Field */}
        <FormInput
          name="email"
          label="Email"
          className="text-xs md:text-sm"
          placeholder="Enter your email"
          leftSection={
            <MailIcon className="size-3 md:size-4 text-muted-foreground" />
          }
        />
        {/* Password Field */}
        <FormInput
          name="password"
          label="Password"
          type="password"
          className="text-xs md:text-sm"
          placeholder="Enter your password"
          leftSection={
            <LockIcon className="size-3 md:size-4 text-muted-foreground" />
          }
        />
        {/* Confirm Password Field */}
        <FormInput
          name="password_confirmation"
          label="Confirm Password"
          type="password"
          className="text-xs md:text-sm"
          placeholder="Confirm your password"
          leftSection={
            <LockKeyholeIcon className="size-3 md:size-4 text-muted-foreground" />
          }
        />
        {/* Submit Button */}
        <Button type="submit" className="w-full text-xs md:text-sm">
          Create Account
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
