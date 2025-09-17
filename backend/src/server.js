import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes imports...
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import chatRoute from "./routes/chatRoute.js";
import groupChatRoute from "./routes/groupChatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();
connectDB();

const app = express();

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// Middleware
// =====================
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ["https://startup-frontend.onrender.com"]
    : "*",  // ✅ allow all in dev
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// =====================
// API Routes
// =====================
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/chat", chatRoute);
app.use("/group", groupChatRoute);
app.use("/messages", messageRoute);

// =====================
// Serve frontend in production
// =====================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../../frontend/dist"); // adjust relative to src
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
 else {
  // Dev mode only
  app.get("/", (req, res) => {
    res.send("BACKEND IS WORKING!!!");
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
