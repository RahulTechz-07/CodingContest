// src/components/GlobalLoader.js
import React from 'react';
import { useLoading } from './LoadingContext';
import './GlobalLoader.css'; // add spinner styling here

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default GlobalLoader;
