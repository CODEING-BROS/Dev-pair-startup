import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";


// 📤 Get all comments for a specific post
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username name profilePicture bio",
      });

    res.status(200).json({ comments, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ❌ Delete a specific comment (only by author)
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found", success: false });
    }

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment", success: false });
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ❤️ Toggle Like/Dislike a comment
export const likeOrDislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found", success: false });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Disliked" : "Liked",
      likesCount: comment.likes.length,
      likedBy: comment.likes,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
