import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskCreate, TaskUpdate } from '../models/task.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TasksService {
    constructor(private http: HttpClient) { }
    getTasks(params?: { status?: 'pending' | 'completed' }): Observable<Task[]> {
        let httpParams = new HttpParams();
        if (params?.status) httpParams = httpParams.set('status', params.status);
        return this.http.get<Task[]>(`${environment.apiBaseUrl}/tasks`, { params: httpParams, withCredentials: true });
    }
    getTaskById(id: string): Observable<Task> {
        return this.http.get<Task>(
            `${environment.apiBaseUrl}/tasks/${id}`,
            { withCredentials: true }
        );
    }
    createTask(dto: TaskCreate): Observable<Task> {
        return this.http.post<Task>(`${environment.apiBaseUrl}/tasks`, dto, { withCredentials: true });
    }

    updateTask(id: string, dto: TaskUpdate): Observable<Task> {
        return this.http.patch<Task>(`${environment.apiBaseUrl}/tasks/${id}`, dto, { withCredentials: true });
    }

    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiBaseUrl}/tasks/${id}`, { withCredentials: true });
    }
}
