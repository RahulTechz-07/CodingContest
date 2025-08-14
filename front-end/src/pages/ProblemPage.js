import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './ProblemPage.css';
import { marked } from 'marked';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useLoading } from './LoadingContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';


const ProblemPage = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [languageId, setLanguageId] = useState("python"); // New (string)
  const [result, setResult] = useState(null);
  const [runPassed, setRunPassed] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const problemId = '687f995ab32165f3c22dc283';
  const [open, setOpen] = useState(false)


    const [username, setUsername] = useState(
    location.state?.username || sessionStorage.getItem('username')
  );
  const [userId, setUserId] = useState(
    location.state?.userId || sessionStorage.getItem('userId')
  );

useEffect(() => {
  if (username) {
    const savedCode = sessionStorage.getItem(`code_${username}_${problemId}`);
    if (savedCode) {
      setSourceCode(savedCode);
    }
  }
}, [problemId, username]);

useEffect(() => {
  if (username) {
    sessionStorage.setItem(`code_${username}_${problemId}`, sourceCode);
  }
}, [sourceCode, problemId, username]);


useEffect(() => {
  // Defer this logic slightly to allow sessionStorage to load properly
  const timeout = setTimeout(() => {
    if (!username || !userId) {
      toast.error("Please register before accessing the problem page.");
      navigate('/thankyou');
    }
  }, 500); // Delay by 0.5 seconds

  return () => clearTimeout(timeout);
}, [username, userId, navigate]);

useEffect(() => {
  window.history.pushState(null, null, window.location.href);
  const blockBack = () => {
    window.history.pushState(null, null, window.location.href);
  };
  window.addEventListener('popstate', blockBack);

  return () => {
    window.removeEventListener('popstate', blockBack);
  };
}, []);



useEffect(() => {
  console.log("🔍 result in useEffect:", result); 
  if (
    result &&
    !result.compile_output &&
    !result.stderr &&
    result.status === "Success"
  ) {
    setRunPassed(true);
  } else {
    setRunPassed(false);
  }
}, [result]);



  const problem = {
    title: "Sum of Two Numbers",
    description: `

In this problem, you are given two integers, a and b. Your task is to write a program that reads these two integers from the standard input and prints their sum to the standard output.

This is one of the simplest yet most fundamental problems in programming. It helps you get started with basic input/output operations and arithmetic logic. Although this task may seem trivial at first, it is crucial for understanding how programming languages deal with standard input and output, data parsing, and expression evaluation.

You are required to accept the two integers as input in a single line, separated by a space. Then, compute and display their sum.

Use this problem as a foundation to get familiar with:
- Reading user input
- Parsing and converting strings to integers
- Performing arithmetic operations
- Writing output in the expected format



Additional Notes:
-----------------
- Make sure that your output does not contain any additional characters, like extra spaces, prompts, or newlines other than what is required.
- Avoid using hardcoded values. Your solution should work for any valid inputs within the constraint range.
- While this is a basic problem, following correct programming principles will help you build discipline in writing clean, correct, and efficient code.
- This problem can be solved in any programming language of your choice.

Try writing the solution in multiple languages if you're preparing for interviews or contests.

Good luck, and happy coding!
    `,
    input: "Two integers a and b (−10⁴ ≤ a, b ≤ 10⁴)",
    output: "Single integer - the sum of a and b",
    constraints: "−10⁴ ≤ a, b ≤ 10⁴",
    testCases: [
      { input: "2 3", output: "5" },
      { input: "-5 5", output: "0" },
      { input: "-1234 -4321", output: "-5555" }
    ]
  };




  const handleNext = () => {
  
  navigate('/problem2', {
    state: {
      userId,
      username
    }
  });
};


const handleRun = async () => {
  setIsLoading(true);
  try {
    const res = await axios.post('/api/run', {
      source_code: sourceCode,
      language: languageId,
      problemId: '687f995ab32165f3c22dc283',
    });

    const response = res.data;
    console.log(response.testCaseResults);
    if (!response.success) {
      setResult({
        compile_output: response.errorType === 'Compilation Error' ? response.message : '',
        stderr: response.errorType === 'Runtime Error' ? response.message : '',
        stdout: '',
        testCaseResults: null,
        status: response.status || 'Error'
      });
    } else {
      setResult({
        compile_output: '',
        stderr: '',
        stdout: response.output || '',
        testCaseResults: response.testCaseResults || [],
        status: response.status || 'Success'
      });
    }

    setError(null);
  } catch (err) {
    console.error(err);
    setError("❌ Run failed: " + (err.response?.data?.message || err.message));
    setResult(null);
  }
  finally{
    setIsLoading(false);
  }
};

const handleSubmit = async () => {
  console.log("runPassed:", runPassed);
  setIsLoading(true);

  if (!runPassed) {
    console.log("❌ Submission blocked - run not passed.");
    toast.error("Please run the code successfully before submitting.");
    return;
  }

  try {
    console.log("🚀 Starting submission...");
    console.log(username);
    console.log(userId);
    const res = await axios.post('/api/submit/', {
      userId: userId,           // dynamically from props
      username: username,              // ⬅️ Replace this with dynamic username
      problemId: '687f995ab32165f3c22dc283',
      source_code: sourceCode,
      language: languageId,
      description: 'Sum of Two Numbers', // You can use `problem.title` here too
    });

    console.log("✅ Submission succeeded!");
  toast.success('Submission saved or updated successfully!');
    setError(null);
  } catch (err) {
    console.error("❌ Error during submission:", err);
    toast.error("Submission failed. Please try again.");
  }
  finally{
    setIsLoading(false);
  }
};


  return (
    <>
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
    <Header />
    <div className="problem-page">
      <div className="problem-details dark-bg">
        <h2>Problem 1: {problem.title}</h2>

        <section>
          <h4>Description</h4>
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: marked(problem.description) }}
          />
        </section>

        <section>
          <h4>Input Format</h4>
          <pre>{problem.input}</pre>
        </section>

        <section>
          <h4>Constraints</h4>
          <pre>{problem.constraints}</pre>
        </section>

        <section>
          <h4>Output Format</h4>
          <pre>{problem.output}</pre>
        </section>

        <section>
          <h4>Sample Test Cases</h4>
          {problem.testCases.map((test, idx) => (
            <div key={idx} className="sample-case">
              <p><strong>Input:</strong><br /><br /><code>{test.input}</code></p>
              <p><strong>Expected Output:</strong><br /><br/><code>{test.output}</code></p>
            </div>
          ))}
        </section>
      </div>

      <div className="code-section">
        <div className="lang-select">
          <label>Language: </label>
          <select onChange={(e) => setLanguageId(e.target.value)} value={languageId}>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
        </div>

       <Editor
  height="400px"
  theme="vs-dark"
  language="python"
  value={sourceCode}
  onChange={(value) => setSourceCode(value || '')}
/>


<div className="buttons">
  <button onClick={handleRun}>Run</button>
  <button
    onClick={handleSubmit}
    disabled={!runPassed}
    className={!runPassed ? 'disabled-button' : 'submit-button'}
  >
    Submit
  </button>
    <button
    onClick={handleNext}
  >
    Next
  </button>
<button onClick={() => setOpen(true)}>End Contest</button>

    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>End Contest?</DialogTitle>
      <DialogContent>
        Are you sure you want to submit and end the contest? You won’t be able to make changes.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          color="error"
          onClick={async () => {
            const email = sessionStorage.getItem("email");
            if (!email) return;
            await axios.post("http://localhost:5001/api/end-contest", {
              email,
              endTime: Date.now(),
            });
            localStorage.removeItem(`contestStart-${sessionStorage.getItem("username")}`);
           navigate('/thankyou', {
  state: {
    username: sessionStorage.getItem('username'),
    teamName: sessionStorage.getItem('teamName'),
    college: sessionStorage.getItem('college')
  }
});

          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>


</div>


{result && (
  <div className="results">
    <h4>Output Console</h4>

    {/* Compilation Error */}
    {result.compile_output && (
      <pre className="output-box error">🛠 Compilation Error:\n{result.compile_output}</pre>
    )}

    {/* Runtime Error */}
    {!result.compile_output && result.stderr && (
      <pre className="output-box error">💥 Runtime Error:\n{result.stderr}</pre>
    )}

    {/* Successful Output */}
    {!result.compile_output && !result.stderr && result.stdout && (
      <pre className="output-box">🟢 Output:\n{result.stdout}</pre>
    )}

    {/* Test Case Results (only if no compile/runtime error) */}
    {!result.compile_output && !result.stderr && result.testCaseResults && (
      <>
        <h4>Test Case Results</h4>
        <ul>
          {result.testCaseResults.map((test, idx) => (
            <li key={idx} className={test.passed ? 'success' : 'error'}>
              <strong>Test Case {idx + 1}:</strong> {test.passed ? '✅ Passed' : '❌ Failed'}<br />
              <strong>Input:</strong> {test.input}<br />
              <strong>Expected:</strong> {test.expected}<br />
              <strong>Output:</strong> {test.output}
              <hr />
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)}

{/* If run completely failed due to network/server/etc. */}
{error && (
  <div className="error-message">
    ⚠️ {error}
  </div>
)}




      </div>
    </div>
    <Footer />
    </motion.div>
    </>
  );
};

export default ProblemPage;
