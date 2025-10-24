import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import tableRoutes from "./routes/tables.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS origins - Admin, Kitchen, and Customer apps
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175", // Admin panel
  "http://localhost:8080", // Customer app
  ...envOrigins, // Production origins from env
];

console.log("Allowed CORS origins:", allowedOrigins);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tables", tableRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

app.get("/" , (req,res)=>{
  res.send("Server is running fine");
})

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
