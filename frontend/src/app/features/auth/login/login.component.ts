import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    private errorService = inject(ErrorService)

    readonly form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = signal(false);
    error = signal('');

    submit() {
        if (this.form.invalid) return this.form.markAllAsTouched();
        this.loading.set(true);
        this.error.set('');
        this.auth.login(this.form.getRawValue() as any).subscribe({
            next: () => {
                this.router.navigateByUrl('/tasks')
                this.auth.bootstrapSession()
                this.loading.set(false)
            },
            error: (err) => {
                this.errorService.capture(err);
                this.error.set(err?.message || err?.error?.message || 'Login failed');
                this.loading.set(false)
            }
        });
    }
}
