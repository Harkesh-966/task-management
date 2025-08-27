import { ZodError, type ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validate =
    <T>(schema: ZodSchema<T>) =>
        (req: Request, _res: Response, next: NextFunction) => {
            try {
                const parsed = schema.parse(req.body);
                (req as any).body = parsed;
                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    return next(new AppError('Validation error', 422));
                }
                next(err);
            }
        };
