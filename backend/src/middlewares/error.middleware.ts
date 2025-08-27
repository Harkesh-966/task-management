import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { apiError } from '../utils/apiResponse';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(apiError(err.message));
    }

    // @ts-ignore
    if (err?.name === 'ValidationError') {
        return res.status(422).json(apiError('Database validation error'));
    }
    // @ts-ignore
    if (err?.code === 11000) {
        return res.status(409).json(apiError('Duplicate key error'));
    }

    return res.status(500).json(apiError('Internal server error'));
};
