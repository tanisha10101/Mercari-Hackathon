import express from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export default (db, firebaseAdmin) => {
  const router = express.Router();

  // Upload video
  router.post('/upload', upload.single('video'), async (req, res) => {
    const file = req.file;

    const bucket = firebaseAdmin.storage().bucket();
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: file.mimetype },
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const videoRef = db.collection('videos').doc();
      await videoRef.set({
        title: file.originalname,
        url: publicUrl,
        views: 0,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(201).json({ message: 'Video uploaded successfully', videoUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
  });

  // Get video and track views
  router.get('/:id', async (req, res) => {
    const videoId = req.params.id;

    try {
      const videoDoc = await db.collection('videos').doc(videoId).get();
      if (!videoDoc.exists) {
        return res.status(404).json({ message: 'Video not found' });
      }

      const videoData = videoDoc.data();

      await db.collection('videos').doc(videoId).update({
        views: firebaseAdmin.firestore.FieldValue.increment(1),
      });

      res.json({ ...videoData, views: videoData.views + 1 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
