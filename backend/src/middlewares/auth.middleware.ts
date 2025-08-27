import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return next(new AppError('Not authenticated', 401));
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, email: payload.email };
        next();
    } catch {
        return next(new AppError('Invalid or expired token', 401));
    }
};
