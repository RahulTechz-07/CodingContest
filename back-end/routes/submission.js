import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Problem from '../models/Problem.js';

const router = (io) => {
  const r = express.Router();

  // Function to run code via Piston
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runCode = async (language, source_code, stdin) => {
  const languageMap = {
    python: "python3",
    cpp: "cpp",
    c: "c",
    java: "java",
  };

  const selectedLanguage = languageMap[language];
  if (!selectedLanguage) {
    return { stdout: "", stderr: `Unsupported language: ${language}` };
  }

  const filename = selectedLanguage === "java" ? "Main.java" : "main";

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: selectedLanguage,
      version: "*",
      files: [{ name: filename, content: source_code }],
      stdin: stdin
    });

    // 👇 Add small delay after each request
    await delay(250);

    return response.data.run;
  } catch (err) {
    console.error("❌ Piston error:", err.response?.data || err.message);
    return { stdout: "", stderr: err.message };
  }
};


  r.post('/', async (req, res) => {
    const { language, source_code, problemId, userId, username } = req.body;
    console.log("🔔 /api/submit hit by", username);

    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Problem not found' });
      }

      const testResults = [];
      for (let testCase of problem.testCases) {
        const { input, output } = testCase;
        const result = await runCode(language, source_code, input);
        const expectedOutput = output.trim();
        const userOutput = (result.stdout || '').trim();

        testResults.push({
          input,
          expectedOutput,
          userOutput,
          passed: expectedOutput === userOutput
        });
      }

      const score = testResults.filter(t => t.passed).length * 20;
      

      const newSubmission = {
        userId,
        username,
        problemId: problemId.toString(),
        language,
        source_code,
        testCaseResults: testResults,
        score
      };

      // Replace if already submitted for this problem
      const existingIndex = user.problems.findIndex(
        (p) => p.problemId.toString() === problemId.toString()
      );

      if (existingIndex >= 0) {
        user.problems[existingIndex] = newSubmission;
      } else {
        user.problems.push(newSubmission);
      }

      await user.save();

      // ✅ Recalculate leaderboard
      const users = await User.find({});
      const allProblems = await Problem.find({});

      const leaderboard = users.map((u) => {
        let totalScore = 0;

        u.problems.forEach((p) => {
          const prob = allProblems.find(pr => pr._id.toString() === p.problemId);
          const maxScore = (prob?.testCases.length || 0) * 20;

          if (p.score > 0 && p.score <= maxScore) {
            totalScore += p.score;
          }
        });

        return {
          userId: u._id.toString(),
          username: u.username,
          teamName: u.teamName || '',
          college: u.college || '',
          score: totalScore
        };
      }).sort((a, b) => b.score - a.score);

      

      io.emit('leaderboardUpdate', leaderboard);

      return res.json({
        success: true,
        testCaseResults: testResults,
        score
      });

    } catch (err) {
      console.error("❌ Error in submission:", err.message);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  return r;
};

export default router;
