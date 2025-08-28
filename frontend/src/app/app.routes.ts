import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'tasks' },
    { path: 'auth', loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES) },
    { path: 'tasks', canActivate: [authGuard], loadChildren: () => import('./features/tasks/routes').then(m => m.TASK_ROUTES) },
    { path: '**', loadComponent: () => import('./shared/not-found/not-found.component').then(c => c.NotFoundComponent) }
];
