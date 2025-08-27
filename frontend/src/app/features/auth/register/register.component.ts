import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ErrorService } from 'src/app/core/services/error.service';
@Component({
    standalone: true,
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private errorService = inject(ErrorService)
    readonly form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    loading = signal(false);
    error = signal('');
    success = '';

    submit() {
        if (this.form.invalid) return this.form.markAllAsTouched();
        this.loading.set(true);
        this.error.set(''); this.success = '';
        this.auth.register(this.form.getRawValue() as any).subscribe({
            next: () => { this.success = 'Account created! Please sign in.'; this.loading.set(false) },
            error: (err) => {
                this.errorService.capture(err)
                this.error.set(err?.message || err?.error?.message || 'Login failed');
                this.loading.set(false)
            }
        });
    }
}
