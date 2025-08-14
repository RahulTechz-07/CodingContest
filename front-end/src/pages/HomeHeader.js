import React from 'react';
import './HomeHeader.css';
import aamecLogo from '../assests/aamec_logo.png';
import naacLogo from '../assests/naac.png';
import nbaLogo from '../assests/NBA.png';
import it from '../assests/it.png';

const HomeHeader = () => {
  return (
    <header className="home-header">
      <div className="header-left">
        <img src={aamecLogo} alt="AAMEC" />
        <div className="text-content">
          <h1 className="event-title">AAMEC - Code War</h1>
          <p className="subtitle">"Test your logic. Conquer the code."</p>
        </div>
      </div>
      <div className="logo-section">
        <img src={it} alt="It" />
        <img src={naacLogo} alt="NAAC" />
        <img src={nbaLogo} alt="NBA" />
      </div>
    </header>
  );
};

export default HomeHeader;
