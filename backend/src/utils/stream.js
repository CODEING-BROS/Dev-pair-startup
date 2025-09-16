import { StreamChat } from "stream-chat";
import "dotenv/config";

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

if (!api_key || !api_secret) {
  console.log("API_KEY and API_SECRET must be set in your environment variables.");
}

const streamClient = StreamChat.getInstance(api_key, api_secret);

// Create/Update Stream user
export const upsertStreamUser = async (userData) => {
  if (!userData?.id) throw new Error("userData must include an 'id' field.");
  try {
    await streamClient.upsertUsers([userData]);
    console.log("Stream user created:", userData.id);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};

// Generate user token
export const generateStreamToken = async (userId) => {
  try {
    const userIdString = userId.toString();
    return streamClient.createToken(userIdString);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};

// Create a group chat
export const createGroupChat = async (groupName, memberIds, channelId = null) => {
  if (!Array.isArray(memberIds) || memberIds.length < 2) {
    throw new Error("Group chat must have at least 2 members.");
  }

  try {
    const channel = streamClient.channel(
      "messaging",
      channelId || undefined, // optional channel ID
      {
        name: groupName,
        members: memberIds,
      }
    );

    await channel.create();
    console.log(`Group chat '${groupName}' created with members:`, memberIds);

    return channel;
  } catch (error) {
    console.error("Error creating group chat:", error);
    throw error;
  }
};

// Add members to a group
export const addGroupMembers = async (channelId, memberIds) => {
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.addMembers(memberIds);
    console.log(`Added members ${memberIds} to group ${channelId}`);
    return true;
  } catch (error) {
    console.error("Error adding members:", error);
    throw error;
  }
};

// Remove members from a group
export const removeGroupMembers = async (channelId, memberIds) => {
  try {
    const channel = streamClient.channel("messaging", channelId);
    await channel.removeMembers(memberIds);
    console.log(`Removed members ${memberIds} from group ${channelId}`);
    return true;
  } catch (error) {
    console.error("Error removing members:", error);
    throw error;
  }
};
