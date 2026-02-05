import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * About Page Component
 * 
 * Displays the About Me section with Apple theme design
 * Appears after MacBook animates to the side (at 3000px scroll)
 */
function About({ aboutMeRef }) {
  const navigate = useNavigate();

  const handleMacOSPortfolio = () => {
    navigate('/mac-app');
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/files/resume.pdf';
    link.download = 'Resume.pdf';
    link.click();
  };

  return (
    <div
      ref={aboutMeRef}
      style={{
        position: 'fixed',
        right: '5%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '400px',
        opacity: 0,
        pointerEvents: 'auto',
        transition: 'opacity 0.3s ease'
      }}
    >
      <h3
        style={{
          fontSize: '2rem',
          fontWeight: '600',
          margin: '0 0 20px 0',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}
      >
        About Me
      </h3>
      <p
        style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '0 0 24px 0',
          fontWeight: '400'
        }}
      >
        I'm a passionate developer creating innovative digital experiences. Crafting beautiful code
        and stunning interfaces.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '12px',
        flexDirection: 'row'
      }}>
        <button
          onClick={handleMacOSPortfolio}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          → Portfolio
        </button>
        
        <button
          onClick={handleDownloadResume}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#000000',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ffffff';
          }}
        >
          ↓ Resume
        </button>
      </div>
    </div>
  );
}

export default About;
