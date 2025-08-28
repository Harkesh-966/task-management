import mongoose, { Schema, Document, Model } from 'mongoose';

export type TaskStatus = 'pending' | 'completed';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

taskSchema.index({ user: 1, status: 1, createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
