import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";   // Database connection
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// Routes
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import chatRoute from "./routes/chatRoute.js";       // Stream token & message-related endpoints
import groupChatRoute from "./routes/groupChatRoute.js";     // Group management
import messageRoute from "./routes/messageRoute.js"; // Optional message persistence
import authRoute from "./routes/authRoute.js";

dotenv.config();
connectDB();

const app = express();

// Test route

// Middleware

// CORS setup
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
};

const __dirname = path.resolve();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/chat", chatRoute);       // Stream token & chat-related backend endpoints
app.use("/group", groupChatRoute);     // Group management endpoints
app.use("/messages", messageRoute); // Optional message persistence in MongoDB


if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
