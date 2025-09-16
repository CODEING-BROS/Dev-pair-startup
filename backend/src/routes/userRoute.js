import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  completeOnboarding,
  followUser,
  unfollowUser,
  getAllUsers,
  getOwnProfile,
  getUserConnections,
} from '../controllers/userController.js';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js'; // for profile picture upload

const router = express.Router();

// ==========================
// AUTH ROUTES
// ==========================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);

// ==========================
// ONBOARDING ROUTE
// ==========================
// Use isAuthenticated to protect the route and multer to handle file upload
router.post(
  '/onboarding',
  isAuthenticated,
  upload.single('profilePicture'),
  completeOnboarding
);

// ==========================
// PROFILE ROUTES
// ==========================
router.get('/profile', isAuthenticated, getOwnProfile);
router.get('/profile/:username', getProfile);
router.post('/profile/edit', isAuthenticated, upload.single('profilePicture'), editProfile);

// ==========================
// SOCIAL ROUTES
// ==========================
router.post('/follow/:id', isAuthenticated, followUser);
router.post('/unfollow/:id', isAuthenticated, unfollowUser);

// ==========================
// MISC ROUTES
// ==========================
router.get('/all', getAllUsers);
router.get('/profile/:username/connections', isAuthenticated, getUserConnections);

export default router;
