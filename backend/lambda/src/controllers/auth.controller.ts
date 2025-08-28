import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { apiSuccess } from '../utils/apiResponse';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) throw new AppError('Email already in use', 409);
        const user = await User.create({ username, email, password });
        return res.status(201).json(apiSuccess({
            id: user._id, username: user.username, email: user.email
        }));
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) throw new AppError('Invalid email or password', 401);
        const ok = await user.comparePassword(password);
        if (!ok) throw new AppError('Invalid email or password', 401);

        const accessToken = signAccessToken({ sub: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });
        const refreshToken = signRefreshToken({ sub: (user._id as mongoose.Types.ObjectId).toString(), email: user.email });
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
        });
        return res.json(apiSuccess({
            user: { id: user._id, username: user.username, email: user.email }
        }));
    } catch (err) {
        next(err);
    }
};

export const refresh = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) throw new AppError('No refresh token', 401);

        const payload = verifyRefreshToken(token);
        const newAccessToken = signAccessToken({ sub: payload.sub, email: payload.email });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        return res.json(apiSuccess({ accessToken: newAccessToken }));
    } catch (err) {
        next(err);
    }
};


export const getInfoCookie = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return next(new AppError('Not authenticated', 401));
    }
    try {
        const payload = verifyAccessToken(token);
        return res.json(apiSuccess({ payload }));

    } catch (err) {
        next(err);

    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.json(apiSuccess({}));
    } catch (err) {
        next(err);
    }
};



