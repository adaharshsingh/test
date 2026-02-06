import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ isIntroComplete = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef(null);

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/files/resume.pdf';
    link.download = 'Resume.pdf';
    link.click();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showNavbar = () => {
    setIsVisible(true);
    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    // Hide after 2 seconds (normal behavior after intro)
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  useEffect(() => {
    // Only start hide timeout when intro is complete
    if (isIntroComplete) {
      // Keep navbar visible for 3 seconds after intro completes
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isIntroComplete]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Show navbar if mouse is within 100px of top
      if (e.clientY < 100) {
        showNavbar();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <nav
      onMouseEnter={showNavbar}
      onMouseLeave={() => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 9998,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Logo placeholder - receives animated intro logo */}
      <div
        id="navbar-logo"
        style={{
          fontSize: '24px',
          fontWeight: '400',
          color: '#ffffff',
          fontFamily: "'Zen Antique', serif",
          letterSpacing: '4px',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.3s ease'
        }}
      >
        ADARSH
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          onClick={() => scrollToSection('skills')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#ffffff',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Skills
        </button>

        <button
          onClick={() => scrollToSection('projects')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#ffffff',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Projects
        </button>

        {/* Resume download button */}
        <button
          onClick={handleDownloadResume}
          style={{
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#ffffff',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Download Resume
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
