import jwt, { type Secret, type SignOptions, type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JWTPayload extends JwtPayload {
    sub: string;
    email: string;
}

type ExpiresIn = SignOptions['expiresIn'];
const toExpiresIn = (v: string | number): ExpiresIn => {
    if (typeof v === 'number') return v;
    if (/^\d+$/.test(v)) return Number(v);
    return v as unknown as ExpiresIn;
};

const accessOpts: SignOptions = { expiresIn: toExpiresIn(env.ACCESS_TOKEN_TTL) };
const refreshOpts: SignOptions = { expiresIn: toExpiresIn(env.REFRESH_TOKEN_TTL) };

export const signAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, accessOpts);
};

export const signRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, refreshOpts);
};

export const verifyAccessToken = (token: string): JWTPayload => {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as Secret);
    if (typeof decoded === 'string') throw new Error('Invalid token payload');
    return decoded as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET as Secret);
    if (typeof decoded === 'string') throw new Error('Invalid token payload');
    return decoded as JWTPayload;
};
