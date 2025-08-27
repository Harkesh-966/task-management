import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../core/services/error.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
    errors = inject(ErrorService);
    dismiss(id: number) { this.errors.dismiss(id); }
}
