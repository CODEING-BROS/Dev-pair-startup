import express from "express";
import {
  getComments,
  deleteComment,
  likeOrDislikeComment,
} from "../controllers/commentController.js";
import  isAuthenticated  from "../middlewares/isAuthenticated.js"; // Adjust path

const router = express.Router();

// ✅ Get all comments for a post
router.get("/:postId", getComments);

// ✅ Delete a comment (only author)
router.delete("/:commentId", isAuthenticated, deleteComment);

// ✅ Like/Dislike a comment
router.post("/like/:commentId", isAuthenticated, likeOrDislikeComment);

export default router;
