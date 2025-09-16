import express from "express";
import { createGroup, addMembers, removeMembers, getUserGroups } from "../controllers/groupChatController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Auth middleware required
router.use(isAuthenticated);

router.post("/create", createGroup);
router.post("/add-members", addMembers);
router.post("/remove-members", removeMembers);
router.get("/my-groups", getUserGroups);

export default router;
