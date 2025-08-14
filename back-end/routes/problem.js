import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

// 📥 Create a new problem with test cases
router.post('/', async (req, res) => {
  try {
    const { title, description, input, output, constraints, testCases } = req.body;

    const newProblem = new Problem({
      title,
      description,
      input,
      output,
      constraints,
      testCases
    });

    await newProblem.save();
    res.status(201).json({ success: true, problemId: newProblem._id });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create problem' });
  }
});

// 📤 Get full problem by ID (for submissions)
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problem' });
  }
});

// 🧪 Get test cases only by problemId
router.get('/:id/testcases', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id, { testCases: 1 });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    res.json(problem.testCases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching test cases' });
  }
});

export default router;
