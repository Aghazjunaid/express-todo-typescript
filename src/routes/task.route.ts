import { Router } from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/task.controller';
import {authMiddleware} from '../utils/auth';

export const roleRoutes = () => {
  const router = Router();

  router.post('/task', authMiddleware, createTask);

  router.get('/tasks', authMiddleware, getAllTasks);

  router.get('/task/:id', authMiddleware, getTaskById);

  router.patch('/task/:id', authMiddleware, updateTask);

  router.delete('/task/:id', authMiddleware, deleteTask);

  return router;
};