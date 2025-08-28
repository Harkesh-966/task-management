import { Injectable, signal } from '@angular/core';

export type ConfirmDialogType = 'default' | 'danger' | 'warning' | 'success';

export interface ConfirmDialogOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: ConfirmDialogType;
    disableBackdropClose?: boolean;
}

const DEFAULTS: Required<Omit<ConfirmDialogOptions, 'message'>> = {
    title: 'Are you sure?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'default',
    disableBackdropClose: false,
};

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    private _open = signal(false);
    private _options = signal<ConfirmDialogOptions>({ message: '' });
    private _resolver?: (v: boolean) => void;

    open(options: ConfirmDialogOptions): Promise<boolean> {
        this._options.set({ ...DEFAULTS, ...options });
        this._open.set(true);
        return new Promise<boolean>((resolve) => {
            this._resolver = resolve;
        });
    }

    confirm() {
        this._open.set(false);
        this._resolver?.(true);
        this._resolver = undefined;
    }

    cancel() {
        this._open.set(false);
        this._resolver?.(false);
        this._resolver = undefined;
    }

    get isOpen() {
        return this._open.asReadonly();
    }

    get opts() {
        return this._options.asReadonly();
    }
}
