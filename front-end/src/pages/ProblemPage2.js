import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './ProblemPage1.css';
import { marked } from 'marked';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useLoading } from './LoadingContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ProblemPage2 = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [languageId, setLanguageId] = useState("python"); // Python
  const [result, setResult] = useState(null);
  const [runPassed, setRunPassed] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const problemId = '6884ce815b4f97e5ecb73171';
  const [open, setOpen] = useState(false);
   const { setIsLoading } = useLoading();
  const { username: stateUsername, userId: stateUserId } = location.state || {};
  const [username, setUsername] = useState(stateUsername || sessionStorage.getItem('username'));
  const [userId, setUserId] = useState(stateUserId || sessionStorage.getItem('userId'));

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
    // If both are missing, redirect to Register page
    if (!username || !userId) {
      toast.alert("Please register before accessing the problem page.");
      navigate('/thankyou');
    }
  }, [username, userId, navigate]);

useEffect(() => {
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
  title: "Check Prime Number",
  description: `

In this problem, you are given a single integer \`n\`. Your task is to determine whether the number is a **prime number**.

A **prime number** is a number greater than 1 that has no positive divisors other than 1 and itself.

For example:
- 2 is prime because it is divisible only by 1 and 2.
- 17 is prime because no other number divides it.
- 15 is **not** prime because it is divisible by 3 and 5.

This problem helps you practice:
- Basic mathematical logic
- Looping constructs and conditions
- Efficiency with input constraints

You should read an integer from standard input and output \`Yes\` if the number is prime, or \`No\` if it is not.

---

Additional Notes:
-----------------
- Do not hardcode specific numbers.
- Make sure your solution works for any input from 1 to 100000.
- Your output should be exactly \`Yes\` or \`No\` with no extra characters.
- Try optimizing by checking up to the square root of \`n\` for divisibility.

Good luck, and keep coding!
  `,
  input: "A single integer n (1 ≤ n ≤ 100000)",
  output: `"Yes" if the number is a prime number, otherwise "No"`,
  constraints: "1 ≤ n ≤ 100000",
  testCases: [
    { input: "2", output: "Yes" },
    { input: "17", output: "Yes" },
    { input: "18", output: "No" },
    { input: "1", output: "No" },
    { input: "97", output: "Yes" }
  ]
};

  const handlePrev =() => {
    navigate('/problem2',{state:{userId,username}});
  };

  



const handleRun = async () => {
  setIsLoading(true);
  try {
    const res = await axios.post('/api/run', {
      source_code: sourceCode,
      language: languageId,
      problemId: '6884ce815b4f97e5ecb73171',
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

    const res = await axios.post('/api/submit', {
       userId: userId,           // dynamically from props
      username: username,              // ⬅️ Replace this with dynamic username
      problemId: '6884ce815b4f97e5ecb73171',
      source_code: sourceCode,
      language: languageId,
      score: 0,
      description: 'Armstrong Number', // You can use `problem.title` here too
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
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -30 }}
  transition={{ duration: 0.4 }}
>
    <Header />
    <div className="problem-page">
      <div className="problem-details dark-bg">
        <h2>Problem 3: {problem.title}</h2>

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
  <button onClick={handlePrev}>Prev</button>
  <button onClick={handleRun}>Run</button>
  <button
    onClick={handleSubmit}
    disabled={!runPassed}
    className={!runPassed ? 'disabled-button' : 'submit-button'}
  >
    Submit
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

export default ProblemPage2;
