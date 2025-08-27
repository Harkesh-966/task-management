import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../core/models/task.models';

@Component({
    standalone: true,
    selector: 'app-tasks-list',
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './tasks-list.component.html',
    styleUrls: ['./tasks-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent implements OnInit {
    private tasksService = inject(TasksService);
    readonly tasks = signal<Task[]>([]);
    readonly loading = signal<boolean>(false);
    readonly error = signal<string>('');

    statusFilter: 'all' | 'pending' | 'completed' = 'all';

    ngOnInit() { this.fetch(); }

    fetch() {
        this.loading.set(true);
        this.error.set('');
        const status = this.statusFilter === 'all' ? undefined : this.statusFilter;
        this.tasksService.getTasks({ status: status as any }).subscribe({
            next: (res: any) => {
                this.tasks.set(res.data || []); this.loading.set(false);
            },
            error: (err) => { this.error.set(err?.error?.message || 'Failed to load tasks'); this.loading.set(false); console.log('---false'); }
        });
    }

    trackById(index: number, t: Task) { return t.id; }
}
