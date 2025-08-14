import express from 'express';
import Participant from '../models/User.js'; // Adjust path as needed
import User from '../models/User.js';

const router = express.Router();
router.get('/check-user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }); // Match field name in schema
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
});
export default router;