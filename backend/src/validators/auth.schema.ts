import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'At least one uppercase letter')
        .regex(/[a-z]/, 'At least one lowercase letter')
        .regex(/[0-9]/, 'At least one digit')
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
