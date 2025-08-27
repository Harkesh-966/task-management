import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, tap, timeout } from 'rxjs/operators';
import { AuthResponse, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { SILENCE_ERRORS } from '../interceptors/error.interceptor';

@Injectable({ providedIn: 'root' })
export class AuthService {
    readonly user = signal<User | null>(null);
    constructor(private http: HttpClient) { }
    bootstrapSession() {
        this.http.get<User>(`${environment.apiBaseUrl}/auth/me`, { withCredentials: true })
            .subscribe({
                next: (u) => this.user.set(u),
                error: () => this.user.set(null)
            });
    }
    login(dto: { email: string; password: string }) {
        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, dto, { withCredentials: true, context: new HttpContext().set(SILENCE_ERRORS, true) })
            .pipe(tap(res => this.user.set(res.user)));
    }

    register(dto: { username: string; email: string; password: string }) {
        return this.http.post<void>(`${environment.apiBaseUrl}/auth/register`, dto, { withCredentials: true, context: new HttpContext().set(SILENCE_ERRORS, true) });
    }

    logout() {
        this.http.post<void>(`${environment.apiBaseUrl}/auth/logout`, {}, { withCredentials: true, context: new HttpContext().set(SILENCE_ERRORS, true) })
            .subscribe({ complete: () => this.user.set(null) });
    }

    isAuthenticated(): boolean { return this.user() !== null; }
}
