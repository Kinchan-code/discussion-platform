import { z } from 'zod';

/**
 * Edit Profile Schema
 * @description Schema for editing user profile information.
 *
 * components used:
 * - zod: For schema validation.
 *
 * @returns {z.ZodObject} The schema for editing profile.
 * @example
 * const schema = editProfileSchema.parse(data);
 */

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address').min(1, 'Email is required'),
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'New password must be at least 8 characters long'),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
