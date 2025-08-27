export type TaskStatus = 'pending' | 'completed';
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    userId: string;
}
export type TaskCreate = Pick<Task, 'title' | 'description' | 'status'>;
export type TaskUpdate = Partial<TaskCreate>;
