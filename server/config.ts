import "dotenv/config";

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-please-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
};


export const SECURITY_CONFIG = {
  BCRYPT_SALT_ROUNDS: 10,
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(",") || [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://*.onrender.com",
    "https://*.railway.app",
    "https://*.vercel.app"
  ],
} as const;

export const DATABASE_CONFIG = {
  URL: process.env.DATABASE_URL || "file:./dev.db",
} as const;

if (!process.env.JWT_SECRET && SERVER_CONFIG.NODE_ENV === "production") {
  console.warn("⚠️  Warning: JWT_SECRET is not set in production environment!");
}

export default {
  SERVER_CONFIG,
  SECURITY_CONFIG,
  DATABASE_CONFIG,
};
