// controllers/userController.js
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import cloudinary  from "../utils/cloudinary.js";
import  getDatauri  from "../utils/dataUri.js";
import bcrypt from "bcryptjs";

// ==========================
// REGISTER
// ==========================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Create token with id ✅
    const token = jwt.sign(
      { id: user._id }, // ✅ always "id"
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // secure only in prod
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==========================
// LOGOUT
// ==========================
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { httpOnly: true, sameSite: "strict", maxAge: 0 })
      .status(200)
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ==========================
// GET OWN PROFILE
// ==========================
export const getOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// ==========================
// GET PROFILE BY USERNAME
// ==========================
// In your backend route file (e.g., controllers/userController.js)

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // ✅ FIX: Use .populate() to fetch the followers and following arrays, and include 'bio'
    const user = await User.findOne({ username })
      .select("-password")
      .populate("followers", "username name profilePicture bio") // 👈 Added 'bio'
      .populate("following", "username name profilePicture bio");  // 👈 Added 'bio'

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ==========================
// EDIT PROFILE
// ==========================
export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name, bio, gender, about, city, country, skills, website, dateofbirth, socialmedia, 
      experiencelevel, availability
    } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDatauri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    // Parse social media if sent as string
    if (typeof req.body.socialmedia === "string") {
      try {
        req.body.socialmedia = JSON.parse(req.body.socialmedia);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid JSON in socialmedia field" });
      }
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    // Update fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;
    user.about = about || user.about;
    user.city = city || user.city;
    user.country = country || user.country;
    user.website = website || user.website;

    if (skills) {
      user.skills = typeof skills === "string"
        ? skills.split(",").map(s => s.trim()).filter(Boolean)
        : skills.map(s => s.trim()).filter(Boolean);
    }

    user.socialmedia = req.body.socialmedia || user.socialmedia;
    user.dateofbirth = req.body.dateofbirth || user.dateofbirth;
    user.experiencelevel = experiencelevel || user.experiencelevel;
    user.availability = availability || user.availability;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    user.isOnboarded = true; // ✅ mark onboarding complete

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ==========================
// COMPLETE ONBOARDING (optional separate endpoint)
// ==========================
export const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      dateofbirth,
      bio,
      gender,
      about,
      city,
      country,
      skills,
      experiencelevel,
      availability,
      socialmedia,
    } = req.body;

    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDatauri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update all onboarding fields
    user.name = name || user.name;
    user.dateofbirth = dateofbirth || user.dateofbirth;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;
    user.about = about || user.about;
    user.city = city || user.city;
    user.country = country || user.country;
    user.experiencelevel = experiencelevel || user.experiencelevel;
    user.availability = availability || user.availability;

    if (skills) {
      user.skills = typeof skills === "string"
        ? skills.split(",").map(s => s.trim()).filter(Boolean)
        : skills.map(s => s.trim()).filter(Boolean);
    }

    if (socialmedia) {
      user.socialmedia = typeof socialmedia === "string" ? JSON.parse(socialmedia) : socialmedia;
    }

    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    user.isOnboarded = true; // ✅ mark user as onboarded

    await user.save();
    res.status(200).json({ success: true, message: "Onboarding complete", user });
  } catch (err) {
    console.error("Onboarding error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// FOLLOW USER
// ==========================
export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.id;
    if (userId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself", success: false });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) return res.status(404).json({ message: "User not found", success: false });

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "You are already following this user", success: false });
    }

    await Promise.all([
      User.updateOne({ _id: userId }, { $push: { following: targetUserId } }),
      User.updateOne({ _id: targetUserId }, { $push: { followers: userId } }),
    ]);

    return res.status(200).json({ message: "User followed successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ==========================
// UNFOLLOW USER
// ==========================
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.id;
    if (userId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself", success: false });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) return res.status(404).json({ message: "User not found", success: false });
    if (!user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "You are not following this user", success: false });
    }

    await Promise.all([
      User.updateOne({ _id: userId }, { $pull: { following: targetUserId } }),
      User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } }),
    ]);

    return res.status(200).json({ message: "User unfollowed successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// ==========================
// GET ALL USERS
// ==========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ==========================
// GET USER CONNECTIONS
// ==========================
export const getUserConnections = async (req, res) => {
  try {
    const username = req.params.username;

    if (!req.user) return res.status(401).json({ message: "Unauthorized", success: false });

    const user = await User.findOne({ username }).populate([
      { path: "followers", select: "_id username profilePicture name followers following" },
      { path: "following", select: "_id username profilePicture name followers following" },
    ]);

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const loggedInUserId = req.user._id.toString();

    const followersWithFlag = user.followers.map(f => ({
      _id: f._id,
      username: f.username,
      profilePicture: f.profilePicture,
      name: f.name,
      isFollowedByCurrentUser: f.following.some(id => id.toString() === loggedInUserId),
    }));

    const followingWithFlag = user.following.map(f => ({
      _id: f._id,
      username: f.username,
      profilePicture: f.profilePicture,
      name: f.name,
      isFollowedByCurrentUser: f.following.some(id => id.toString() === loggedInUserId),
    }));

    const mutualConnections = user.followers
      .filter(f => user.following.some(f2 => f2._id.toString() === f._id.toString()))
      .map(f => ({
        _id: f._id,
        username: f.username,
        profilePicture: f.profilePicture,
        name: f.name,
        isFollowedByCurrentUser: f.following.some(id => id.toString() === loggedInUserId),
      }));

    return res.status(200).json({ success: true, followers: followersWithFlag, following: followingWithFlag, mutualConnections });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
