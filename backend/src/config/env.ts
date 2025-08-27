import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CORS_ORIGIN: z.string().default('http://localhost:4200'),
    MONGODB_URI: z.string().url().or(z.string().regex(/^mongodb/)),
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    ACCESS_TOKEN_TTL: z.string().default('15m'),
    REFRESH_TOKEN_TTL: z.string().default('7d'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
    RATE_LIMIT_MAX: z.coerce.number().default(100)
});

export const env = envSchema.parse(process.env);
