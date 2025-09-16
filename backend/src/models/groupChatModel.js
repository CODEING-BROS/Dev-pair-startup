import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true }, // Stream channel ID
  name: { type: String, required: true },                   // Group name
  members: [{ type: String, required: true }],              // Array of user IDs
  createdBy: { type: String, required: true },              // Creator user ID
  description: { type: String },                            // Optional
  image: { type: String },                                  // Optional group image
}, { timestamps: true });

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
export default GroupChat;
