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

app.use(cors({
  origin: SECURITY_CONFIG.CORS_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/api", routes);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_CONFIG.PORT}`);
});

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
