import { z } from 'zod';

/**
 * Schema for user registration.
 * @description This schema validates the user registration form fields.
 *
 * @returns {z.ZodObject} The Zod object schema for registration.
 * @example
 * const result = registerSchema.safeParse({ name: 'John Doe', email: '<email>', password: '<password>', password_confirmation: '<password_confirmation>' });
 */

export const registerSchema = z
  .object({
    name: z.string().min(5, 'Name must be at least 5 characters long'),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'], // This will show the error on the password_confirmation field
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
