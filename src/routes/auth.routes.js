import express from 'express';
import {
  register,
  login,
  logout,
  token,
} from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);

authRoutes.post('/login', login);

authRoutes.post('/token', token);

authRoutes.post('/logout', logout);

export default authRoutes;