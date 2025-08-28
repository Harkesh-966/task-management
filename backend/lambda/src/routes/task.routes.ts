import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller';
import { createTaskSchema, updateTaskSchema } from '../validators/task.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
