import {
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../errors/api-error.model';

export const SILENCE_ERRORS = new HttpContextToken<boolean>(() => false);

function isAuthPath(url: string) {
    return /\/auth\/(login|register|me|logout)/.test(url);
}

function pickMessage(err: HttpErrorResponse): { message: string; details?: any } {
    const body = err.error;

    if (err.status === 0) return { message: 'Network error. Please check your connection.' };

    if (typeof body === 'string') return { message: body };
    if (Array.isArray(body)) return { message: body.join(', ') };

    if (body && typeof body === 'object') {
        if (typeof body.message === 'string') return { message: body.message, details: body.details ?? body.errors };
        if (Array.isArray(body.message)) return { message: body.message.join(', '), details: body.details ?? body.errors };
        if (typeof body.error === 'string') return { message: body.error, details: body.details ?? body.errors };
        if (typeof body.detail === 'string') return { message: body.detail, details: body.details ?? body.errors };
        if (body.errors && typeof body.errors === 'object') {
            const first = Object.values(body.errors)[0] as any;
            const msg = Array.isArray(first) ? first[0] : String(first);
            return { message: msg, details: body.errors };
        }
    }

    return { message: err.statusText || `Request failed (${err.status})` };
}

function normalize(err: HttpErrorResponse): ApiError {
    const { message, details } = pickMessage(err);
    const body = (err.error ?? {}) as any;
    return {
        status: err.status,
        code: body?.code,
        message,
        details,
        url: err.url || undefined,
    };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const errors = inject(ErrorService);
    const auth = inject(AuthService);

    const silent = req.context.get(SILENCE_ERRORS);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            const apiErr = normalize(err);
            if (!silent) {
                if (apiErr.status === 401 && !isAuthPath(req.url)) {
                    auth.logout();
                    errors.show('Your session expired. Please sign in again.');
                    router.navigateByUrl('/auth/login');
                } else if (apiErr.status === 400 || apiErr.status === 422) {
                    errors.capture(apiErr);
                } else if (apiErr.status === 403) {
                    errors.show('You do not have permission to perform this action.');
                } else if (apiErr.status === 404) {
                    errors.show('Not found.');
                } else if (apiErr.status === 409) {
                    errors.capture({ ...apiErr, message: apiErr.message || 'Conflict. Please retry.' });
                } else if (apiErr.status === 429) {
                    errors.show('Too many requests. Please slow down.');
                } else if (apiErr.status >= 500) {
                    errors.show('Server error. Please try again later.');
                } else if (apiErr.status === 0) {
                    errors.capture(apiErr);
                } else {
                    errors.capture(apiErr);
                }
            }

            return throwError(() => apiErr);
        })
    );
};
