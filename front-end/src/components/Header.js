import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');
  const email = sessionStorage.getItem('email');

  // Get initial timer value based on sessionStorage
  const getInitialTimeLeft = () => {
    if (!username) return "30:00";
    const startTimeStr = sessionStorage.getItem(`startTime-${username}`);
    if (!startTimeStr) return "30:00";

    const startTime = parseInt(startTimeStr);
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = 30 * 60 * 1000 - elapsed;

    if (remaining <= 0) return "00:00";

    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);

  useEffect(() => {
    if (!username) return;

    const startTimeStr = sessionStorage.getItem(`startTime-${username}`);
    if (!startTimeStr) return;

    const startTime = parseInt(startTimeStr);

    const countdownInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = 30 * 60 * 1000 - elapsed;

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        setTimeLeft("00:00");

        const endContest = async () => {
          try {
            const email = sessionStorage.getItem('email');
            if (email) {
              await axios.post('http://localhost:5000/api/end-contest', { email });
            }
          } catch (error) {
            console.error("Error ending contest:", error);
          }
          navigate('/thankyou', {
  state: {
    username: sessionStorage.getItem('username'),
    teamName: sessionStorage.getItem('teamName'),
    college: sessionStorage.getItem('college')
  }
});
        };

        endContest();
      } else {
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [username, navigate]);

  return (
    <header className="contest-header">
      <div className="left-section">
        <h1 className="logo">🏆Code-Contest</h1>
        <p className="subtitle">Crack the logic • Conquer the contest</p>
      </div>

      <div className="middle-section">
        {username && (
          <div className="user-info">
            <span><strong>User:</strong> {username}</span><br />
            {email && <span><strong>Email:</strong> {email}</span>}
          </div>
        )}
      </div>

      <div className="right-section">
        <div className="status-box">
          <span className="live-dot">🟢</span>
          <span className="live-text">Live</span>
        </div>
        <div className="timer-box">
          ⏳ Time Left: <span id="timer">{timeLeft}</span>
        </div>
        <button className="leaderboard-btn" onClick={() => navigate('/leaderboard')}>
          🏁 Leaderboard
        </button>
      </div>
    </header>
  );
};

export default Header;
