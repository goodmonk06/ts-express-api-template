import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).regex(slugRegex).optional(),
});

export const listTagsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
export type UpdateTagDto = z.infer<typeof updateTagSchema>;
export type ListTagsQuery = z.infer<typeof listTagsSchema>;
