import { jwtconfig, verifyToken } from '../utils/jwt-helpers.js';

export default function(req, res, next) {
  const authHeader = req.headers['auth-token'] || req.headers['authorization'];
  const accessToken = authHeader.split(' ')[1];

  if (!accessToken) {
    // stop user auth validation
    return res
      .status(401)
      .send({ auth: false, msg: 'Access Denied. No token provided.' });
  }

  try {
    // verify the token is correct
    const user = verifyToken(accessToken, jwtconfig.access, req, res); // {id: 1, iat: wlenfwekl, expiredIn: 9174323 }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).send({ msg: 'Invalid Token' });
  }
};