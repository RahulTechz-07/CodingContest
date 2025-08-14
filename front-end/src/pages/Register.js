import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Register.css';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoading } from './LoadingContext';
import backgroundImg from '../assests/bg.png';

const colleges = ['AAMEC', 'MIT', 'GCT', 'PSG', 'Other'];

const Register = ({ onRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    teamName: '',
    email: '',
    phone: ''
  });
   const { setIsLoading } = useLoading();

  const navigate = useNavigate();

  // ✅ Redirect if already registered (from session)
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      navigate('/instructions', {
      state: { username: username, userId: sessionStorage.getItem('userId') }
    });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const { name, college, teamName, email, phone } = formData;

  // Custom validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !college || !teamName || !email || !phone) {
    toast.error("All fields are required!");
    return;
  }

  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address!");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    toast.error("Phone number must be exactly 10 digits!");
    return;
  }

  try {
    const res = await axios.post('https://codingcontest.onrender.com/api/register', formData);
    const userId = res.data.user.userId;

    sessionStorage.setItem('username', name);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('college', college);
    sessionStorage.setItem('teamName', teamName);

    toast.success("Registration successful!");

    if (onRegistered) {
      onRegistered(name);
    }

    navigate('/instructions', {
      state: { username: name, userId: userId }
    });

  } catch (err) {
    console.error(err);
    toast.error("Already Registered Email!");
  }
  finally{
    setIsLoading(false);
  }
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
        <div className="register-container">
          <h2>Participant Registration</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="college">College</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
              >
                <option value="">Select College</option>
                {colleges.map(clg => (
                  <option key={clg} value={clg}>{clg}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="teamName">Team Name</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone">Phone Number</label>
              <input
                  type="tel"
                  name="phone"
                  pattern="\d{10}"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

            </div>

            <button type="submit">Register</button>
          </form>
        </div>
        <HomeFooter />
      </motion.div>
    </div>
  );
};

export default Register;
