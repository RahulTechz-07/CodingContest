import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructionPage.css';
import backgroundImg from '../assests/bg.png';
import { motion } from 'framer-motion';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

const InstructionPage = () => {
  const navigate = useNavigate();

  // ✅ Prevent back navigation
  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, []);

  // ✅ Check registration and contest state
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userId");

    if (!username || !userId) {
      // Not registered → go to register
      navigate("/register");
      return;
    }

    // Check if user already started
    const hasStarted = sessionStorage.getItem(`hasStarted-${username}`);
    if (hasStarted) {
      navigate("/problem1", { state: { userId, username } });
    }
  }, [navigate]);

  // ✅ Start contest
  const handleStart = () => {
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userId");
    const startTime = Date.now();

    sessionStorage.setItem(`startTime-${username}`, startTime);
    sessionStorage.setItem(`hasStarted-${username}`, true);

    navigate("/problem1", { state: { userId, username } });
  };


 return (
  <div
    style={{
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <HomeHeader />
      <div className="instruction-container">
        <h1 className="instruction-heading">Instructions to be Followed</h1>

        <div className="instruction-greeting">
          <p>
            <strong>Dear {sessionStorage.getItem('username')}</strong>,<br />
            Welcome to <span className="highlight">Code War!</span> 
          </p>
          <p>
            Please carefully read the instructions below before starting your contest. Let’s play fair and give it your best shot! 
          </p>
        </div>

        <div className="instruction-box">
          
         <ul>
  <li>❌ Don’t copy the problem or answers from the internet – it's strictly prohibited.</li>
  <li>❌ Don’t copy from friends – doing so will lead to disqualification.</li>
  <li>🚫 <strong>Do not close this tab</strong> after registration – you can’t rejoin if closed.</li>
  <li>🕒 <strong>Timer (30 mins)</strong> starts once you click <strong>Start</strong>.</li>
  <li>🔒 The contest will automatically end after 30 minutes.</li>
  <li>✅ You can end early using the <strong>End Contest</strong> button.</li>
  <li>🛠️ Code must run <strong>without any errors</strong> to be submitted.</li>
  <li>💾 Submissions are saved <strong>only</strong> when code runs successfully.</li>
  <li>🧠 There are <strong>3 problems</strong>. Use the navigation buttons to switch between them.</li>
  <li>📞 For any doubts or issues, contact on-spot coordinators immediately.</li>
  <li>📧 Only one registration per email is allowed – re-registration is not possible.</li>
  <li>📊 The <strong>Leaderboard</strong> shows your current rank based on total score.</li>
  <li>🧪 Each problem has <strong>10 test cases</strong>, each worth 10 points.</li>
  <li>🏆 The <strong>maximum score</strong> across all problems is 300 points.</li>
  <li>👤 Only participants who <strong>submit at least one solution</strong> will appear on the leaderboard.</li>
</ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="start-button"
          onClick={handleStart}
        >
          Start Contest
        </motion.button>
      </div>
      <HomeFooter />
    </motion.div>
  </div>
);

};

export default InstructionPage;
