import GroupChat from "../models/groupChatModel.js";
import { createGroupChat, addGroupMembers, removeGroupMembers, generateStreamToken } from "../utils/stream.js";

// Create a new group chat
export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;

    if (!name || !memberIds || memberIds.length < 2) {
      return res.status(400).json({ success: false, message: "Group name and at least 2 members required." });
    }

    // Create group in Stream
    const channel = await createGroupChat(name, memberIds);

    // Save group metadata in MongoDB
    const group = await GroupChat.create({
      channelId: channel.id,
      name,
      members: memberIds,
      createdBy: req.user.id, // assuming auth middleware sets req.user
    });

    // Generate Stream token for the creator
    const token = await generateStreamToken(req.user.id);

    res.status(201).json({
      success: true,
      group,
      token,
      message: "Group chat created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add members to an existing group
export const addMembers = async (req, res) => {
  try {
    const { channelId, memberIds } = req.body;

    if (!channelId || !memberIds || memberIds.length === 0) {
      return res.status(400).json({ success: false, message: "channelId and memberIds required" });
    }

    await addGroupMembers(channelId, memberIds);

    // Update MongoDB record
    await GroupChat.findOneAndUpdate(
      { channelId },
      { $addToSet: { members: { $each: memberIds } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Members added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove members from an existing group
export const removeMembers = async (req, res) => {
  try {
    const { channelId, memberIds } = req.body;

    if (!channelId || !memberIds || memberIds.length === 0) {
      return res.status(400).json({ success: false, message: "channelId and memberIds required" });
    }

    await removeGroupMembers(channelId, memberIds);

    // Update MongoDB record
    await GroupChat.findOneAndUpdate(
      { channelId },
      { $pull: { members: { $in: memberIds } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Members removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all groups a user belongs to
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await GroupChat.find({ members: userId });

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
