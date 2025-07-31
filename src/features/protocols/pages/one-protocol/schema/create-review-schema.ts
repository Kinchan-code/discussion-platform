import { z } from 'zod';

/**
 * Create Review Schema
 * @description Schema for creating a review
 *
 * components used
 * - zod
 *
 * @returns {z.ZodObject} The Zod schema for creating a review.
 * @example
 * const reviewData = createReviewSchema.parse({
 *   rating: 5,
 *   feedback: 'Great protocol!'
 * });
 */

export const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  feedback: z.string().optional(),
});

export type CreateReviewSchemaType = z.infer<typeof createReviewSchema>;
