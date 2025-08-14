import React, { useEffect } from 'react';
import './ThankYou.css';
import backgroundImg from '../assests/bg.png';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || 'Participant';
  const teamName = location.state?.teamName || 'Your Team';
  const college = location.state?.college || 'Your College';

  // Redirect to home if accessed directly
  useEffect(() => {
    if (!location.state) {
      navigate('/thankyou', {
        state: {
          username: sessionStorage.getItem('username'),
          teamName: sessionStorage.getItem('teamName'),
          college: sessionStorage.getItem('college')
        }
      }, { replace: true });
    }
  }, [location, navigate]);

  // Prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    preventBack();
    window.addEventListener('popstate', preventBack);
    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

  const handleLeaderboard = () => {
    navigate('/leaderboard');
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
    <div className="thankyou-container">
      <div className="confetti" />
      <div className="thankyou-card">
        <h1 className="fade-in">Thank You, {username}!</h1>
        <h2 className="slide-in">Team: {teamName}</h2>
        <h3 className="slide-in delay-1">College: {college}</h3>
        <p className="fade-in delay-2">
          We sincerely appreciate your participation in this event conducted by the
          <strong> Department of IT, AAMEC</strong>.
        </p>
        <p className="fade-in delay-3">Wishing you all the best in your coding journey!</p>

        <button className="leaderboard-btn1 fade-in delay-4" onClick={handleLeaderboard}>
          🔍 View Leaderboard
        </button>
      </div>
    </div>
    <HomeFooter />
    </motion.div>
    </div>
  );
};

export default ThankYou;
