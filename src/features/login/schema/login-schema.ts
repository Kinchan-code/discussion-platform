import { z } from 'zod';

/**
 * Login Schema
 * @description Schema for validating login form inputs
 *
 * @property {string} email - User's email address
 * @property {string} password - User's password
 *
 * @returns {z.ZodObject} The Zod schema for login validation.
 */

export const loginSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
