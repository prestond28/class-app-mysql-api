import express from 'express';
import { getMe, updateMe } from '../controllers/user.controller.js';
import canAccess from '../middleware/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.get('/me', canAccess, getMe); // /api/user/me

userRoutes.put('/me/update', canAccess, updateMe);

export default userRoutes;