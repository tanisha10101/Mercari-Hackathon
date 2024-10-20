import express from "express";
import jwt from "jsonwebtoken";
import Video from "../models/Video.js";
import admin from "firebase-admin";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

// Upload Video
router.post("/upload", authMiddleware, async (req, res) => {
  const { title, url } = req.body;
  try {
    const video = new Video({ title, url, uploadedBy: req.user.userId });
    await video.save();
    res.status(201).json({ message: "Video uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Video and Update Views
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
