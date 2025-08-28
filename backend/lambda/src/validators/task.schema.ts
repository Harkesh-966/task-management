import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(['pending', 'completed']).optional()
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(['pending', 'completed']).optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update'
});
