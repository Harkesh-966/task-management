import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/task.model';
import { AppError } from '../utils/AppError';
import { apiSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { io } from '../index';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const task = await Task.create({ ...req.body, user: userId });
        io.to(userId).emit('task:created', task);
        return res.status(201).json(apiSuccess(task));
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { status, search, page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc' } = req.query as Record<string, string>;

        const filter: any = { user: userId, isDelete: false };
        if (status && ['pending', 'completed'].includes(status)) filter.status = status;
        if (search) filter.$text = { $search: search };

        const pageNum = Math.max(parseInt(page) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [items, total] = await Promise.all([
            Task.find(filter).sort(sort).skip(skip).limit(limitNum),
            Task.countDocuments(filter)
        ]);

        return res.json(apiSuccess(items, {
            page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum)
        }));
    } catch (err) {
        next(err);
    }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid id', 400);
        const task = await Task.findOne({ _id: id, user: req.user!.id });
        if (!task) throw new AppError('Task not found', 404);
        return res.json(apiSuccess(task));
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid id', 400);
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user!.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!task) throw new AppError('Task not found', 404);
        io.to(req.user!.id).emit('task:updated', task);
        return res.json(apiSuccess(task));
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid id', 400);
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user!.id },        // filter
            { $set: { isDelete: true } },           // update
            { new: true, runValidators: true }      // return updated doc
        );
        if (!task) throw new AppError('Task not found', 404);
        io.to(req.user!.id).emit('task:deleted', { _id: id });
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
