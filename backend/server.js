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
// COMPREHENSIVE CORS CONFIGURATION
// ====================================

// Define CORS options
const corsOptions = {
  // Step 1: Check if the requesting origin is in our allowed list
  origin: function (origin, callback) {
    console.log("Incoming request from origin:", origin);

    // Step 2: Allow requests with no origin (mobile apps, postman, curl, server-to-server)
    if (!origin) {
      console.log("✓ Allowing request with no origin (non-browser)");
      return callback(null, true);
    }

    // Step 3: Check if origin is in our allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("✓ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("✗ Origin BLOCKED by CORS:", origin);
      console.log("Allowed origins are:", allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },

  // Step 4: Allow credentials (cookies, authorization headers, TLS client certificates)
  credentials: true,

  // Step 5: Expose these headers to the frontend JavaScript
  exposedHeaders: ["Authorization"],

  // Step 6: Allow these HTTP methods
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  // Step 7: Allow these headers in requests
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  // Step 8: Cache preflight requests for 1 hour (3600 seconds)
  // This reduces the number of OPTIONS requests
  maxAge: 3600,

  // Step 9: Pass the CORS preflight response to the next handler
  preflightContinue: false,

  // Step 10: Provide a successful status for OPTIONS requests
  optionsSuccessStatus: 204,
};

// Apply CORS middleware with our options
app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options("*", cors(corsOptions));

// Manual CORS headers as additional safety layer
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Only set headers if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    res.setHeader("Access-Control-Max-Age", "3600");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

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
