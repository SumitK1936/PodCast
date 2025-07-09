// src/components/SplashScreen.jsx
import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="glow-bg"></div>
      <img src="/img/logo.png" alt="PodVerse Logo" className="logo" />

    </div>
  );
};

export default SplashScreen;
