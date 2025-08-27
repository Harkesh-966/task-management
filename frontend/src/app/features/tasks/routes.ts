import { Routes } from '@angular/router';

export const TASK_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./list/tasks-list.component').then(c => c.TasksListComponent) },
  { path: 'new', loadComponent: () => import('./form/task-form.component').then(c => c.TaskFormComponent) },
  { path: ':id/edit', loadComponent: () => import('./form/task-form.component').then(c => c.TaskFormComponent) }
];
