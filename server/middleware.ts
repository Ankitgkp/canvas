import jwt from "jsonwebtoken";
import express from "express";
import { SERVER_CONFIG } from "./config.js";

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, SERVER_CONFIG.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    (req as any).user = user;
    next();
  });
};

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });
  
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
    body: req.body,
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
  });
  next();
};

export const notFoundHandler = (req: express.Request, res: express.Response) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
};
