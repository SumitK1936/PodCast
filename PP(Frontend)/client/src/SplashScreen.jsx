// src/components/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [showText, setShowText] = useState(false);

  const icons = [
    { icon: '🎧', color: '#3b82f6' },
    { icon: '▶️', color: '#10b981' },
    { icon: '❤️', color: '#ef4444' },
    { icon: '🎵', color: '#8b5cf6' },
    { icon: '🔊', color: '#f59e0b' }
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 800);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => {
      clearInterval(iconInterval);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="splash-screen">
      {/* Animated Background */}
      <div className="animated-bg">
        <div 
          className="floating-icon"
          style={{ top: '20%', left: '10%' }}
        >
          ✨
        </div>
        
        <div 
          className="floating-icon"
          style={{ top: '60%', right: '15%' }}
        >
          🎵
        </div>
        
        <div 
          className="floating-icon"
          style={{ bottom: '30%', left: '20%' }}
        >
          ❤️
        </div>
      </div>

      {/* Main Content */}
      <div className="splash-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <div
              key={currentIcon}
              style={{ color: icons[currentIcon].color }}
              className="rotating-icon"
            >
              {icons[currentIcon].icon}
            </div>
          </div>
        </div>

        {/* Text Section */}
        {showText && (
          <div className="text-section">
            <h1 className="app-title">
              PodVerse
            </h1>
            
            <p className="app-subtitle">
              Your gateway to inspiring audio journeys
            </p>
            
            <div className="features">
              <span className="feature">🎧 Discover</span>
              <span className="feature">❤️ Like</span>
              <span className="feature">🎵 Listen</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        <div className="loading-indicator">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          
          <p className="loading-text">
            Loading amazing content...
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar"></div>
    </div>
  );
};

export default SplashScreen;
