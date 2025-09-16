// backend/src/controllers/chatController.js
import { generateStreamToken, createGroupChat } from "../utils/stream.js";
import { Conversation } from "../models/conversationModel.js";

// Generate a Stream token for a logged-in user
export const getStreamToken = async (req, res) => {
  try {
    const token = await generateStreamToken(req.user.id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error fetching stream token:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Create a new group chat
export const createChatGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const creatorId = req.user.id; // ✅ Get the creator's ID

    // ✅ FIX: Ensure the creator's ID is always included and prevent duplicates
    const sanitizedMembers = Array.from(new Set([...members, creatorId]));

    if (!name || sanitizedMembers.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Group name and at least 2 members are required" 
      });
    }

    const channel = await createGroupChat(name, sanitizedMembers);
    res.status(201).json({ 
      success: true, 
      channelId: channel.id, 
      name: channel.data.name,
      members: channel.state.members 
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};



export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "username profilePicture"); // Populate to get participant details

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};