import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: true, // Stream channel ID
    },
    senderId: {
      type: String,
      required: true, // User ID of the sender
    },
    text: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String, // URL or file reference
      },
    ],
    // Optional: store Stream message ID for reference
    streamMessageId: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
