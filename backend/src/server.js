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
app.get("/", (req, res) => {
  res.send("BACKEND IS WORKING!!!");
});

// =====================
// Middleware
// =====================

// ✅ CORS setup for both local + production frontend
const allowedOrigins = [
  "http://localhost:5173",                      // local frontend
  "https://startup-frontend.onrender.com"       // deployed frontend (change to your actual URL)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const __dirname = path.resolve();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// =====================
// Routes
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
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// =====================
// Start server
// =====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
