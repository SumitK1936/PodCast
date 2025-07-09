import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const AuthLayout = ({ children }) => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0f172a', overflow: 'hidden' }}>
      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#0f172a' } },
          fpsLimit: 60,
          particles: {
            number: { value: 30 },
            shape: {
              type: 'char',
              character: [
                { value: '🎧', font: 'Verdana', style: '', weight: '400' },
                { value: '🎙️', font: 'Verdana', style: '', weight: '400' },
                { value: '📻', font: 'Verdana', style: '', weight: '400' },
                { value: '🔊', font: 'Verdana', style: '', weight: '400' }
              ]
            },
            opacity: { value: 0.7 },
            size: { value: 24 },
            move: { enable: true, speed: 0.5, outModes: 'bounce' }
          }
        }}
        style={{ position: 'absolute', zIndex: 0 }}
      />

      {/* Glowing blob shapes */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)',
          top: '-100px',
          left: '-100px',
          filter: 'blur(60px)',
          animation: 'floatBlob 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
          bottom: '-80px',
          right: '-80px',
          filter: 'blur(50px)',
          animation: 'floatBlob 10s ease-in-out infinite reverse'
        }} />
      </div>

      {/* Animated SVG wave at bottom */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100px', animation: 'waveMove 10s linear infinite' }}>
          <path
            fill="#10b981"
            fillOpacity="0.2"
            d="M0,96L48,80C96,64,192,32,288,26.7C384,21,480,43,576,74.7C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        animation: 'fadeInSlide 1s ease'
      }}>
        <div style={{
          background: 'rgba(30,41,59,0.85)',
          padding: '2rem',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          border: '2px solid rgba(16,185,129,0.4)',
          transition: 'all 0.3s ease',
          animation: 'floatCard 4s ease-in-out infinite'
        }}>
          {children}
        </div>
      </div>

      {/* Keyframe styles */}
      <style>
        {`
          @keyframes floatBlob {
            0%   { transform: translateY(0px) rotate(0deg); }
            50%  { transform: translateY(20px) rotate(20deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          @keyframes floatCard {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }

          @keyframes waveMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthLayout;
