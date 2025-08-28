import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
    readonly svc = inject(ConfirmDialogService);
    private lastFocused: Element | null = null;
    @HostListener('document:keydown', ['$event'])
    onKeydown(e: KeyboardEvent) {
        if (!this.svc.isOpen()) return;
        if (e.key === 'Escape') {
            if (!this.svc.opts().disableBackdropClose) this.svc.cancel();
        }
        if (e.key === 'Enter') {
            this.svc.confirm();
        }
    }

    onBackdropClick() {
        if (!this.svc.opts().disableBackdropClose) this.svc.cancel();
    }

    onOpenChanged(open: boolean) {
        if (open) {
            this.lastFocused = document.activeElement;
            setTimeout(() => (document.getElementById('confirm-primary') as HTMLButtonElement)?.focus());
        } else {
            (this.lastFocused as HTMLElement | null)?.focus?.();
        }
    }

    openWatcher = signal(this.svc.isOpen());
}
