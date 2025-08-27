import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../../core/services/tasks.service';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
    standalone: true,
    selector: 'app-task-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tasks = inject(TasksService);
    private errorService = inject(ErrorService)

    id: string | null = null;
    loading = false;
    error = '';

    form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(2)]],
        description: [''],
        status: ['pending', [Validators.required]]
    });

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getTaskDetail()
    }

    cancel() { this.router.navigateByUrl('/tasks'); }

    submit() {
        if (this.form.invalid) return this.form.markAllAsTouched();
        this.loading = true; this.error = '';
        const dto = this.form.getRawValue() as any;
        const req = this.id ? this.tasks.updateTask(this.id, dto) : this.tasks.createTask(dto);
        req.subscribe({
            next: () => this.router.navigateByUrl('/tasks'),
            error: (err) => {
                this.errorService.capture(err)
                this.loading = false
            }
        });
    }

    getTaskDetail() {
        this.loading = true
        this.error = ''
        this.tasks.getTaskById(this.id || '').subscribe({
            next: (res: any) => {
                this.loading = false
                const { title, description, status } = res.data || {}
                this.form.patchValue({
                    title,
                    description,
                    status
                })

            },
            error: (err) => {
                this.errorService.capture(err)
                this.loading = false
            }
        });
    }
}
