import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollInstructions Component
 * 
 * Displays scroll hint at the bottom of the hero section
 * Fades out on first scroll, fades back in on reverse scroll
 */
function ScrollInstructions() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Fade out as soon as scroll starts (by 10px)
      // Fade back in when scroll returns to near top
      if (scrollY > 10) {
        setOpacity(0);
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '1rem',
        zIndex: 10,
        textAlign: 'center',
        opacity: opacity,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: opacity === 0 ? 'none' : 'auto'
      }}
    >
      <p style={{ margin: 0 }}>Scroll to open the MacBook ↓</p>
    </div>
  );
}

export default ScrollInstructions;
