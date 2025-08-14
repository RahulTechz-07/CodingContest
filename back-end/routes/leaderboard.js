import express from 'express';
import User from '../models/User.js'; // Ensure your User model file ends with .js

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    const leaderboard = users.map(user => {
      const totalScore = user.problems.reduce((sum, prob) => sum + (prob.score || 0), 0);
      return {
        _id: user._id,
        username: user.username,
        teamName:user.teamName,
        college:user.college,
        score: totalScore
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
