import bcrypt from 'bcryptjs';

import connection from '../db-config.js';
import query from '../utils/query.js';
import {
  GET_ME_BY_USER_ID,
  GET_ME_BY_USER_ID_WITH_PASSWORD,
  UPDATE_USER,
} from '../queries/user.queries.js';

export async function getMe(req, res) {
  // verify valid token
  const decoded = req.user; // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }

  // take result of middleware check
  if (decoded.id) {
    // establish a connection
    const con = await connection().catch((err) => {
      throw err;
    });

    const user = await query(con, GET_ME_BY_USER_ID, [decoded.id]).catch(
      (err) => {
        res.status(500).send({ msg: 'Could not find the user.' });
      }
    );

    if (!user.length) {
      res.status(400).send({ msg: 'No user found.' });
    }
    res.status(200).send(user);
  }
};

export async function updateMe(req, res) {
  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // check for existing user first
  const user = await query(con, GET_ME_BY_USER_ID_WITH_PASSWORD, [
    req.user.id,
  ]).catch((err) => {
    res.status(500);
    res.send({ msg: 'Could not retrieve user.' });
  });

  // checked for password changed
  // SAME LOGIC AS CHECKING FOR A VALID PASSWORD
  const passwordUnchanged = await bcrypt
    .compare(req.body.password, user[0].password)
    .catch((err) => {
      res.json(500).json({ msg: 'Invalid password!' });
    });

  if (!passwordUnchanged) {
    const passwordHash = bcrypt.hashSync(req.body.password);

    // perform update
    const result = await query(con, UPDATE_USER, [
      req.body.username,
      req.body.email,
      passwordHash,
      user[0].id,
    ]).catch((err) => {
      res.status(500).send({ msg: 'Could not update user settings.' });
    });

    if (result.affectedRows === 1) {
      res.json({ msg: 'Updated succesfully!' });
    }
    res.json({ msg: 'Nothing to update...' });
  }
};