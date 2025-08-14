import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './LeaderBoard.css';
import HomeFooter from './HomeFooter';
import HomeHeader from './HomeHeader';
import backgroundImg from '../assests/bg.png';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5001'); // Adjust this if hosted

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data);
    });

    fetch('http://localhost:5001/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));

    return () => {
      socket.off('leaderboardUpdate');
      socket.disconnect();
    };
  }, []);

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
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Live Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>🏅 Rank</th>
            <th>Username</th>
            <th>Team Name</th>
            <th>College</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.teamName || '—'}</td>
              <td>{user.college || '—'}</td>
              <td>{user.score} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
       <HomeFooter />
    </motion.div>
    </div>
  );
};

export default Leaderboard;
