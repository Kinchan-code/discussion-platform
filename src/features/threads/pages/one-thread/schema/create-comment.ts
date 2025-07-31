import { z } from 'zod';

/**
 * Create Comment Schema
 * @description Schema for validating create comment data.
 *
 * @returns {z.ZodObject} The Zod schema for create comment.
 */

export const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, 'Please enter a comment.')
    .max(500, 'Comment is too long.'),
});

export type CreateCommentSchemaType = z.infer<typeof createCommentSchema>;
