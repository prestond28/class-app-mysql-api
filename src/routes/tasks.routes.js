import express from 'express';
import {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';
import canAccess from '../middleware/auth.middleware.js';

const tasksRoutes = express.Router();
/**
 * Express routes for Tasks.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all tasks. Evaluates to `/tasks/`.
 */
tasksRoutes.get('/', canAccess, getAllTasks).post('/', canAccess, createTask);

/**
 * Routes for a task by id. Evalutes to `/tasks/:task_id`.
 */
tasksRoutes
  .get('/:task_id', canAccess, getTask) // GET http://locahost:3000/api/tasks/1
  .put('/:task_id', canAccess, updateTask)
  .delete('/:task_id', canAccess, deleteTask);

export default tasksRoutes;