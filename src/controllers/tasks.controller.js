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
    res.status(500).send({ message: 'Database connection failed', error: err.message });
  });

  // query all tasks
  const tasks = await query(con, ALL_TASKS, [req.user.id]).catch((err) => {
    res.send(err);
    //res.status(500).send({ message: 'Query execution failed', error: err.message });
  });
  
if (!tasks.length) {
  res.status(400).send({ message: 'No tasks available for this user' });
} else {
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
  const task = await query(con, SINGLE_TASK, [req.user.id, req.params.taskId]).catch(
    (err) => {
      res.send(err);
    }
  );

  if (task.length === 0) {
    res.status(404).send({ message: 'Task not found' });
  } else {
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
  const user = req.user; // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }

  // take result of middleware check
  if (user.id) {
    // establish connection
    const con = await connection().catch((err) => {
      throw err;
    });

    // query add task
    const result = await query(con, INSERT_TASK, [req.user.id, req.body.task_name]).catch(
      (err) => {
        res.send(err);
      }
    );
    console.log(result);

    if (result.affectedRows !== 1) {
      res
        .status(500)
        .json({ msg: `Unable to add task: ${req.body.task_name}` });
    }
    res.json({ message: 'Added task successfully!' });
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

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to update task where task name = '${req.body.task_name}'` });
  }
  res.json(result);
};

// http://localhost:3000/tasks/1
export async function deleteTask(req, res) {
  // establish connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // query delete task
  const result = await query(con, DELETE_TASK, [req.user.id, req.params.taskId]).catch(
    (err) => {
      res.send(err);
    }
  );

  if (result.affectedRows !== 1) {
    res
      .status(500)
      .json({ msg: `Unable to delete task where task id = ${req.params.taskId}` });
  }
  res.json({ msg: 'Deleted successfully.' });
};