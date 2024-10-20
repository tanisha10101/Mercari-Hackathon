import express from "express";
import mongoose from "mongoose";
import admin from "firebase-admin";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import videoRoutes from "./routes/video.js";

// Initialize Firebase Admin
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MongoDB connection string is not defined.");
  process.exit(1); // Exit the process if the URI is not defined
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
