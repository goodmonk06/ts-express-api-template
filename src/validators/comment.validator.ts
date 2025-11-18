import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  postId: z.string().uuid('Invalid post ID'),
  parentId: z.string().uuid('Invalid parent comment ID').optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
});

export const listCommentsSchema = z.object({
  postId: z.string().uuid('Invalid post ID').optional(),
  authorId: z.string().uuid('Invalid author ID').optional(),
  parentId: z.string().uuid('Invalid parent ID').optional().nullable(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsSchema>;
