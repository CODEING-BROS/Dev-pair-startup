import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addNewPost , getAllPosts , getUserPosts ,likePost , unlikePost , deletePost , bookmarkPost , addComment , getPostComments   } from '../controllers/postController.js';

const router = express.Router();

// Add new post route
router.route('/new').post(isAuthenticated, upload.single('image'), addNewPost);

// Get all posts route
router.route('/all').get(isAuthenticated, getAllPosts);

// Get User's posts route
router.route('/user/:username').get(isAuthenticated, getUserPosts);

// like post route
router.route('/like/:postId').post(isAuthenticated, likePost);

// unlike post route
router.route('/unlike/:postId').post(isAuthenticated, unlikePost);

// Delete post route
router.route('/delete/:postId').delete(isAuthenticated, deletePost);

// bookmark post route
router.route('/bookmark/:postId').post(isAuthenticated, bookmarkPost);

// Add comment route
router.route('/:postId/comment').post(isAuthenticated, addComment);

// Get post comments route
router.route('/:postId/comments').get(isAuthenticated, getPostComments);

export default router;