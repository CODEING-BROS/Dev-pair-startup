import express from 'express';
import {getOwnProfile}  from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/me', isAuthenticated, getOwnProfile);

export default router;