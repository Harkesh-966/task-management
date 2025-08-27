import { Injectable, signal } from '@angular/core';
import { ApiError } from '../errors/api-error.model';

export type ToastKind = 'error' | 'success' | 'info' | 'warn';
export interface Toast { id: number; kind: ToastKind; text: string; timeout: number; }

@Injectable({ providedIn: 'root' })
export class ErrorService {
    private _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();
    private _id = 0;

    show(text: string, kind: ToastKind = 'error', timeout = 10000) {
        const id = ++this._id;
        this._toasts.update(list => [...list, { id, kind, text, timeout }]);
        if (timeout > 0) setTimeout(() => this.dismiss(id), timeout);
    }
    dismiss(id: number) {
        this._toasts.update(list => list.filter(t => t.id !== id));
    }
    capture(err: ApiError) {
        const msg = err.message || `Error ${err.status || ''}`.trim();
        this.show(msg, 'error');
    }
}
