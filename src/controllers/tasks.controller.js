import connection from '../db-config.js';
import {
  ALL_TASKS,
  SINGLE_TASK,
  INSERT_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from '../queries/tasks.queries.js';
import query from '../utils/query.js';

/**
 * CRUD - Create, Read, Update, Delete
 * GET - Read
 * POST - Create
 * PUT - Update
 * DELETE - Delete
 */

// http://localhost:3000/tasks
export async function getAllTasks(req, res) {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query all tasks
  const tasks = await query(con, ALL_TASKS).catch((err) => {
    res.send(err);
  });

  if (tasks.length) {
    res.json(tasks);
  }
};

// http://localhost:3000/tasks/1
export async function getTask(req, res) {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query all task
  const task = await query(con, SINGLE_TASK, [req.params.taskId]).catch(
    (err) => {
      res.send(err);
    }
  );

  if (task.length) {
    res.json(task);
  }
};

// http://localhost:3000/tasks
/**
 * POST request -
 * {
 *  name: 'A task name'
 * }
 */
export async function createTask(req, res) {
  // verify valid token
  const decoded = req.user; // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }

  // take result of middleware check
  if (decoded.id) {
    // establish connection
    const con = await connection().catch((err) => {
      throw err;
    });

    // query add task
    const result = await query(con, INSERT_TASK, [req.body.name]).catch(
      (err) => {
        res.send(err);
      }
    );
    console.log(result);

    if (result.affectedRows === 1) {
      res.json({ message: 'Added task successfully!' });
    }
  }
};

// http://localhost:3000/tasks/1
/**
 * PUT request -
 * {
 *  name: 'A task name',
 *  state: 'completed'
 * }
 */
export async function updateTask(req, res) {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query update task
  const result = await query(con, UPDATE_TASK, [
    req.body.name,
    req.body.status,
    req.params.taskId,
  ]).catch((err) => {
    res.send(err);
  });

  if (result.affectedRows === 1) {
    res.json(result);
  }
};

// http://localhost:3000/tasks/1
export async function deleteTask(req, res) {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query delete task
  const result = await query(con, DELETE_TASK, [req.params.taskId]).catch(
    (err) => {
      res.send(err);
    }
  );

  if (result.affectedRows === 1) {
    res.json({ message: 'Deleted successfully.' });
  }
};