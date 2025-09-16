import Message from "../models/messageModel.js";

// Save a new message
export const saveMessage = async (req, res) => {
  try {
    const { channelId, senderId, text, attachments, streamMessageId } = req.body;

    const newMessage = await Message.create({
      channelId,
      senderId,
      text,
      attachments,
      streamMessageId,
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get messages by channel
export const getMessagesByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
