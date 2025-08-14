import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();
const router = express.Router();
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

router.post('/', async (req, res) => {
  const { source_code, language, problemId } = req.body;

  if (!source_code || !language) {
    return res.status(400).json({ success: false, message: "Missing source code or language." });
  }

  try {
    let testCases = [];

    // Fetch test cases from DB
    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (problem?.testCases?.length) {
        testCases = problem.testCases;
      }
    }

    const testCaseResults = [];
    const languageMap = {
  python: "python3",
  cpp: "cpp",
  c: "c",
  java: "java",
};

const selectedLanguage = languageMap[language];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

for (let testCase of testCases) {
  const payload = {
    language: selectedLanguage,
    version: "*",
    files: [{ name: "main", content: source_code }],
    stdin: testCase.input || ''
  };

  const pistonRes = await axios.post(PISTON_API, payload);
  const { run } = pistonRes.data;
  const { stdout = '', stderr = '' } = run;

  if (stderr) {
    return res.json({
      success: false,
      errorType: 'Runtime Error',
      message: stderr,
      status: 'Runtime Error'
    });
  }

  const actualOutput = stdout.trim();
  const expectedOutput = (testCase.output || '').trim();

  testCaseResults.push({
    input: testCase.input,
    expected: expectedOutput,
    output: actualOutput,
    passed: actualOutput === expectedOutput
  });

  // 👇 throttle requests to avoid rate-limit
  await delay(250); // 250ms is safe (more than piston’s 200ms limit)
}

   console.log(testCaseResults);
   
    return res.json({
      success: true,
      output: testCaseResults[0]?.output || '',
      testCaseResults,
      status: 'Success'
    });

  } catch (error) {
    console.error("❌ Piston error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      errorType: 'Server Error',
      message: error.response?.data || error.message || 'Unknown server error'
    });
  }
});

export default router;
