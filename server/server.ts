import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { errorHandler, notFoundHandler, requestLogger } from "./middleware.js";
import DatabaseService from "./database.js";
import { SERVER_CONFIG, SECURITY_CONFIG } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: SECURITY_CONFIG.CORS_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use(express.static(path.join(__dirname, "..", "dist")));

// API Routes
app.use("/api", routes);

// Serve static files in production - handle all non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${SERVER_CONFIG.PORT}`);
  console.log(`📊 Environment: ${SERVER_CONFIG.NODE_ENV}`);
  console.log(`📋 Available routes:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/register`);
  console.log(`  POST /api/login`);
  console.log(`  POST /api/verify-token`);
  console.log(`  GET  /api/profile (protected)`);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await DatabaseService.disconnect();
});

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await DatabaseService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await DatabaseService.disconnect();
  process.exit(0);
});
