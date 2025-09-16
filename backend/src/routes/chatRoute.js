import express from "express";
import { getStreamToken, createChatGroup } from "../controllers/chatController.js"; // Your auth middleware
import { getConversations } from "../controllers/chatController.js";
import  isAuthenticated  from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get a Stream token for the logged-in user
router.get("/token", isAuthenticated, getStreamToken);

// Create a new group chat
router.post("/create-group", isAuthenticated, createChatGroup);

// ✅ NEW: Route to get a user's conversations
router.get("/conversations", isAuthenticated, getConversations);

export default router;