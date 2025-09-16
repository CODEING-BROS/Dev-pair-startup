import express from "express";
import { saveMessage, getMessagesByChannel } from "../controllers/messageController.js";

const router = express.Router();

// POST /api/messages -> save new message
router.post("/", saveMessage);

// GET /api/messages/:channelId -> get messages by channel
router.get("/:channelId", getMessagesByChannel);

export default router;
