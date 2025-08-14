// routes/user.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();

// ✅ Registration Route
router.post('/register', async (req, res) => {
  const { name, college, teamName, email, phone } = req.body;
  console.log(req.body);
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    console.log(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = new User({
      userId: uuidv4(),
      username: name,
      email,
      phone,
      college,
      teamName,
      problems: [],
      startTime: new Date()  // ⏱ Store start time
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful', user: newUser });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ✅ Save Contest End Time Route
router.post('/end-contest', async (req, res) => {
  const { email, endTime } = req.body;

  if (!email || !endTime) {
    return res.status(400).json({ message: 'Missing email or end time.' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { endTime: new Date(endTime) },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Contest end time saved successfully', user });

  } catch (error) {
    console.error('Error saving end time:', error);
    res.status(500).json({ message: 'Server error while saving end time' });
  }
});

export default router;
