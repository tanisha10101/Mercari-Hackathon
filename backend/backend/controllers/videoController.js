// controllers/videoController.js
import Video from "../models/Video.js";
import { storage } from "../config/firebase.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    // Upload file to Firebase Storage
    const bucket = storage.bucket();
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      throw new Error("Something went wrong when uploading the file");
    });

    blobStream.on("finish", async () => {
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      // Create a new video document
      const video = new Video({
        title,
        description,
        url: publicUrl,
        userId: req.user.uid,
      });

      await video.save();

      res.status(201).json({ message: "Video uploaded successfully", video });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
