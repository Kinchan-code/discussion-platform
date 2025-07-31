import { z } from 'zod';

/**
 * Schema for creating a protocol.
 * @description This schema defines the structure and validation rules for creating a protocol.
 *
 * @property {string} title - The title of the protocol, required and must be at least 1 character long.
 * @property {string} content - The content of the protocol, required and must be at least 1 character long.
 * @property {Array<string>} tags - An array of tags associated with the protocol, required and must contain at least one tag.
 *
 * @returns {z.ZodObject} The Zod schema for protocol creation.
 */

export const createProtocolSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

export type CreateProtocolSchemaType = z.infer<typeof createProtocolSchema>;
