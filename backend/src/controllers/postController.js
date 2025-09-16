import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import sharp from "sharp";
import { Comment } from "../models/commentModel.js";

export const addNewPost = async (req, res) => {
  try {
    const { title, tags } = req.body;
    const authorId = req.user._id;
    const image = req.file;
    // Check if image is provided
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // check is title and description are provided
    if (!title || !tags) {
      return res.status(400).json({ message: "Title and tags are required" });
    }

    // Upload image to Cloudinary
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize(800, 800, { fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to base64 string
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      title,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean), // ✅
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate("author", "username bio name profilePicture");

    res
      .status(201)
      .json({ message: "Post created successfully", post, success: true });
  } catch (error) {
    console.error("Error adding new post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username bio name profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username bio name profilePicture" },
      });

    res
      .status(200)
      .json({ posts, message: "Posts fetched successfully", sucess: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username bio name profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username bio name profilePicture" },
      });

    res.status(200).json({
      posts,
      message: "User posts fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });

    const updatedPost = await Post.findById(postId);

    res
      .status(200)
      .json({
        message: "Post liked successfully",
        post: updatedPost,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

    const updatedPost = await Post.findById(postId);

    res
      .status(200)
      .json({
        message: "Post unliked successfully",
        post: updatedPost,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the post from the author's posts array
    const user = await User.findById(userId);
    if (user) {
      user.posts = user.posts.filter(
        (post) => post.toString() !== postId.toString()
      );
      await user.save();
    }

    await Comment.deleteMany({ post: postId });

    res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await Comment.create({
      post: postId,
      author: userId,
      text: message,
    });

    const comment = await Comment.findById(newComment._id).populate({
      path: "author",
      select: "username name profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
      .populate({ path: "author", select: "username name profilePicture bio" })
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({
        comments,
        message: "Comments fetched successfully",
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if the user has already bookmarked the post
    const user = await User.findById(userId);
    const isBookmarked = user?.bookmarks.some(id => id.toString() === postId.toString());

    let updatedUser;
    let message;
    let type;

    if (isBookmarked) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: postId } },
        { new: true }
      );
      message = "Post removed from bookmarks";
      type = "unsaved";
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: postId } },
        { new: true }
      );
      message = "Post added to bookmarks";
      type = "saved";
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      type,
      message,
      success: true,
      user: updatedUser, // You might want to return the updated user
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

