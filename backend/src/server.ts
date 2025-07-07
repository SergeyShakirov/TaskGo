import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import "reflect-metadata";

import aiRoutes from "./routes/ai";
import exportRoutes from "./routes/export";
import taskRoutes from "./routes/tasks";
import { initializeDatabase } from "./models/database";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://taskgo.com"]
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:8081",
          ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskGo Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/ai", aiRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  // Initialize database and start server
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 TaskGo Backend is running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🤖 AI API: http://localhost:${PORT}/api/ai`);
        console.log(`📄 Export API: http://localhost:${PORT}/api/export`);
        console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
        console.log(`💾 Database: Connected and initialized`);
      });
    })
    .catch((error) => {
      console.error("❌ Failed to initialize database:", error);
      process.exit(1);
    });
}

export default app;
