import express from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { authenticateToken } from "./middleware.js";
import { prisma } from "./database.js";
import { SERVER_CONFIG, SECURITY_CONFIG } from "./config.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username and password are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      SERVER_CONFIG.JWT_SECRET as string,
      { expiresIn: SERVER_CONFIG.JWT_EXPIRES_IN } as SignOptions
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Email/username and password are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      SERVER_CONFIG.JWT_SECRET as string,
      { expiresIn: SERVER_CONFIG.JWT_EXPIRES_IN } as SignOptions
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify token endpoint
router.post("/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  jwt.verify(token, SERVER_CONFIG.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.json({ 
      valid: true, 
      user: {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      }
    });
  });
});

router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "API is running"
  });
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post("/rooms", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { name } = req.body;
    const roomCode = generateRoomCode();
    const room = await prisma.room.create({
      data: { name: name || "My Room", roomCode, userId }
    });
    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.get("/rooms", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const rooms = await prisma.room.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: "Failed to get rooms" });
  }
});

router.get("/rooms/:roomCode", authenticateToken, async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await prisma.room.findUnique({
      where: { roomCode }
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: "Failed to get room" });
  }
});

router.get("/rooms/:roomCode/shapes", authenticateToken, async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    const shapes = await prisma.shape.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ shapes });
  } catch (error) {
    res.status(500).json({ error: "Failed to get shapes" });
  }
});

router.post("/rooms/:roomCode/shapes", authenticateToken, async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const { shapeId, data } = req.body;
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    const shape = await prisma.shape.create({
      data: { shapeId, data, roomId: room.id }
    });
    res.status(201).json({ shape });
  } catch (error) {
    res.status(500).json({ error: "Failed to save shape" });
  }
});

router.delete("/rooms/:roomCode/shapes/:id", authenticateToken, async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const shapeId = parseInt(req.params.id);
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    await prisma.shape.deleteMany({
      where: { id: shapeId, roomId: room.id }
    });
    res.json({ message: "Shape deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shape" });
  }
});

router.delete("/rooms/:roomCode/shapes", authenticateToken, async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const room = await prisma.room.findUnique({ where: { roomCode } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    await prisma.shape.deleteMany({
      where: { roomId: room.id }
    });
    res.json({ message: "All shapes deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shapes" });
  }
});

export default router;
