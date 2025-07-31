import { z } from 'zod';

/**
 * Schema for creating a new thread.
 * @description Validates the input fields for creating a thread.
 *
 * @property {string} protocol_id - The ID of the protocol associated with the thread.
 * @property {string} title - The title of the thread.
 * @property {string} body - The content of the thread.
 *
 * @returns {z.ZodObject} The Zod schema for thread creation.
 */

export const createThreadSchema = z.object({
  protocol_id: z.string().min(1, 'Protocol ID is required'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Content is required'),
});

export type CreateThreadSchemaType = z.infer<typeof createThreadSchema>;
