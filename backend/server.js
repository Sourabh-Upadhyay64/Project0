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

console.log("Environment ALLOWED_ORIGINS:", process.env.ALLOWED_ORIGINS);
console.log("Parsed env origins:", envOrigins);
console.log("Final allowed CORS origins:", allowedOrigins);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ====================================
// CORS MIDDLEWARE CONFIGURATION
// ====================================

// Step 1: Handle CORS manually with custom middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log("Incoming request from origin:", origin);

  // Step 2: Check if origin is in our allowed list
  if (origin && allowedOrigins.includes(origin)) {
    // Step 3: Allow this specific origin (never use '*' with credentials)
    res.setHeader("Access-Control-Allow-Origin", origin);

    // Step 4: Allow credentials (cookies, authorization headers)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Step 5: Specify allowed HTTP methods
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // Step 6: Specify allowed headers for JSON requests and authentication
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );

    // Step 7: Cache preflight response for 1 hour to reduce OPTIONS requests
    res.setHeader("Access-Control-Max-Age", "3600");

    console.log("✓ CORS headers set for origin:", origin);
  } else if (origin) {
    console.log("✗ Origin BLOCKED by CORS:", origin);
    console.log("Allowed origins:", allowedOrigins);
  } else {
    // Step 8: Allow requests with no origin (Postman, curl, server-to-server)
    console.log("✓ Request with no origin (non-browser)");
  }

  // Step 9: Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    // Respond with 204 No Content for successful preflight
    return res.status(204).end();
  }

  // Step 10: Continue to next middleware/route handler
  next();
});

// Parse JSON bodies
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

app.get("/", (req, res) => {
  res.send("Server is running fine");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
