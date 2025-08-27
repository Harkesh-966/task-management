import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { AuthService } from './app/core/services/auth.service';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './app/core/error-handler/global-error.handler';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
function initAuth(auth: AuthService) {
    const url = (typeof window !== 'undefined'
        ? window.location.pathname + window.location.search + window.location.hash
        : '/');
    if (!url.includes("/auth")) {
        return () => auth.bootstrapSession();
    } else {
        return () => null
    }
}
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideAnimations(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: APP_INITIALIZER, useFactory: initAuth, deps: [AuthService], multi: true }
    ]
}).catch(err => console.error(err));
