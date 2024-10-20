import express from 'express';

export default (db, firebaseAdmin) => {
  const router = express.Router();

  // Register
  router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;

    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      await db.collection('users').doc(userRecord.uid).set({
        username,
        email,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(201).json({ message: 'User registered successfully', userRecord });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const auth = firebaseAdmin.auth();

    try {
      const userRecord = await auth.getUserByEmail(email);
      const customToken = await auth.createCustomToken(userRecord.uid);

      res.json({ message: 'Login successful', token: customToken });
    } catch (error) {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  });

  return router;
};
