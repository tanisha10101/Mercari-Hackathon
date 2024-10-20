import dotenv from 'dotenv';
import express from 'express';
import firebaseAdmin from 'firebase-admin';

// Firebase Admin Setup
dotenv.config();
const firebaseConfig = JSON.parse(process.env.FIREBASE_KEY_PATH);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  storageBucket: "mercarihackd.appspot.com",
});

import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';  // Importing the default export

const db = firebaseAdmin.firestore();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes(db, firebaseAdmin));
app.use('/videos', videoRoutes(db, firebaseAdmin));  // Using the default import

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
