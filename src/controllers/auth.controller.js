import bcrypt from 'bcryptjs';

import connection from '../db-config.js';
import {
  GET_ME_BY_USERNAME,
  GET_ME_BY_USERNAME_WITH_PASSWORD,
  INSERT_NEW_USER,
} from '../queries/user.queries.js';
import query from '../utils/query.js';
import {
  refreshTokens,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt-helpers.js';

export async function register(req, res) {
  // params setup
  const passwordHash = bcrypt.hashSync(req.body.password);
  const params = [req.body.username, req.body.email, passwordHash];

  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // check for existing user first
  const user = await query(con, GET_ME_BY_USERNAME, [req.body.username]).catch(
    (err) => {
      console.log('Error checking user:', err);
      res.status(500).send({ msg: 'Database error. Please try again later.' });
    }
  );

  // console.log('User check result:', user);

  // if we get one result back
  if (user?.length === 1) {
    res.status(403).send({ msg: 'User already exists!' });
  } else {
    // add new user
    const result = await query(con, INSERT_NEW_USER, params).catch((err) => {
      //   stop registeration
      res
        .status(500)
        .send({ msg: 'Could not register user. Please try again later.' });
    });

    res.send({ msg: 'New user created!' });
  }
};

export async function login(req, res) {
  // establish a connection
  const con = await connection().catch((err) => {
    throw err;
  });

  // check for existing user first
  const user = await query(con, GET_ME_BY_USERNAME_WITH_PASSWORD, [
    req.body.username,
  ]).catch((err) => {
    res.status(500);
    res.send({ msg: 'Could not retrieve user.' });
  });

  // if the user exists
  if (user?.length === 1) {
    //   validate entered password from database saved password
    const validPass = await bcrypt
      .compare(req.body.password, user[0].password)
      .catch((err) => {
        res.json(500).json({ msg: 'Invalid password!' });
      });

    if (!validPass) {
      res.status(400).send({ msg: 'Invalid password!' });
    }
    // create token
    const accessToken = generateAccessToken(user[0].user_id, {
      // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }
      expiresIn: 86400,
    });
    const refreshToken = generateRefreshToken(user[0].user_id, {
      expiresIn: 86400,
    });

    refreshTokens.push(refreshToken);

    res
      .header('access_token', accessToken) // ex.: { 'aut-token': 'lksnenha0en4tnoaeiwnlgn3o4i'}
      .send({
        auth: true,
        msg: 'Logged in!',
        token_type: 'bearer',
        access_token: accessToken,
        expires_in: 86400,
        refresh_token: refreshToken,
      });
  }
};

export function token (req, res) {
  const refreshToken = req.body.token;

  // stop user auth validation if no token provided
  if (!refreshToken) {
    return res
      .status(401)
      .send({ auth: false, msg: 'Access Denied. No token provided.' });
  }

  // stop refresh is refresh token invalid
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).send({ msg: 'Invalid Refresh Token' });
  }

  const verified = verifyToken(refreshToken, jwtconfig.refresh, req, res);

  if (verified) {
    const accessToken = generateToken(user[0].user_id, { expiresIn: 86400 });
    return res
      .header('access_token', accessToken) // ex.: { 'aut-token': 'lksnenha0en4tnoaeiwnlgn3o4i'}
      .send({
        auth: true,
        msg: 'Logged in!',
        token_type: 'bearer',
        access_token: accessToken,
        expires_in: 20,
        refresh_token: refreshToken,
      });
  }
  return res.status(403).send({ msg: 'Invalid Token' });
};

export function logout(req, res) {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

  return res.send({ msg: 'Logout successful' });
};