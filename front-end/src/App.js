import React, { useEffect, useState } from 'react';
import './App.css';
import ProblemPage from './pages/ProblemPage';
import ProblemPage1 from './pages/ProblemPage1';
import ProblemPage2 from './pages/ProblemPage2';
import Register from './pages/Register';
import ScrollToTop from './components/ScrollToTop';
import ThankYou from './pages/ThankYou';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Leaderboard from './pages/LeaderBoard';
import InstructionPage from './pages/InstructionPage';
import { LoadingProvider } from './pages/LoadingContext';
import GlobalLoader from './pages/GlobalLoader';


function AnimatedRoutes({ username, setUsername }) {
  const location = useLocation();
  const hasStarted = sessionStorage.getItem('hasStarted');

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Registration */}
        <Route
          path="/"
          element={
            username
              ? <Navigate to={hasStarted ? "/problem1" : "/instructions"} replace />
              : <Register onRegistered={(name) => {
                  sessionStorage.setItem('username', name);
                  setUsername(name);
                }} />
          }
        />

        {/* Instructions */}
        <Route
          path="/instructions"
          element={
            username && !hasStarted
              ? <InstructionPage />
              : <Navigate to={hasStarted ? "/problem1" : "/"} replace />
          }
        />

        {/* Problems */}
        <Route
          path="/problem1"
          element={
            username && hasStarted
              ? <ProblemPage />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/problem2"
          element={
            username && hasStarted
              ? <ProblemPage1 />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/problem3"
          element={
            username && hasStarted
              ? <ProblemPage2 />
              : <Navigate to="/" replace />
          }
        />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); // ✅ loading state to wait for validation

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');

    if (storedUsername) {
      axios.get(`/api/check-user/${storedUsername}`)
        .then(res => {
          if (res.data.exists) {
            setUsername(storedUsername);
          } else {
            sessionStorage.removeItem('username');
          }
        })
        .catch(err => {
          console.error('Error verifying user', err);
          sessionStorage.removeItem('username');
        })
        .finally(() => {
          setLoading(false); // ✅ Done checking
        });
    } else {
      setLoading(false); // ✅ No user to validate
    }
  }, []);

  return (
     <LoadingProvider>
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <GlobalLoader />
      {!loading && (
        <AnimatedRoutes username={username} setUsername={setUsername} />
      )}
    </Router>
    </LoadingProvider>
  );
}

export default App;
