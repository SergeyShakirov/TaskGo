import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get all tasks with filters
router.get('/', taskController.getTasks.bind(taskController));

// GET /api/tasks/:id - Get single task
router.get('/:id', taskController.getTask.bind(taskController));

// POST /api/tasks - Create new task
router.post('/', taskController.createTask.bind(taskController));

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
