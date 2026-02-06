import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSmoothedProgress } from '../hooks/useHeroLoading';

const IntroLoader = ({ onLoadComplete }) => {
  const smoothProgress = useSmoothedProgress();
  const loaderRef = useRef(null);
  const underlineRef = useRef(null);
  const [canExit, setCanExit] = useState(false);

  // Enforce minimum loader duration (Apple trick)
  useEffect(() => {
    if (smoothProgress >= 99) {
      const timer = setTimeout(() => {
        setCanExit(true);
      }, 400); // Minimum 400ms of visibility
      return () => clearTimeout(timer);
    }
  }, [smoothProgress]);

  // Underline animation (0-100% progress)
  useEffect(() => {
    if (!underlineRef.current) return;

    gsap.to(underlineRef.current, {
      scaleX: smoothProgress / 100,
      transformOrigin: 'left center',
      duration: 0.2,
      ease: 'power1.out',
      overwrite: 'auto'
    });

    // Add completion glow at 100%
    if (smoothProgress >= 99) {
      gsap.to(underlineRef.current, {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)',
        duration: 0.2
      });
    }
  }, [smoothProgress]);

  // Trigger exit animation when ready
  useEffect(() => {
    if (canExit && smoothProgress >= 99) {
      handleLoadingComplete();
    }
  }, [canExit, smoothProgress]);

  const handleLoadingComplete = () => {
    if (!loaderRef.current) return;

    const centerLogo = loaderRef.current.querySelector('#intro-logo h1');
    const navLogo = document.getElementById('navbar-logo');

    if (!centerLogo || !navLogo) {
      console.warn('Logo elements not found');
      if (onLoadComplete) onLoadComplete();
      return;
    }

    const fromRect = centerLogo.getBoundingClientRect();
    const toRect = navLogo.getBoundingClientRect();

    // Calculate scale
    const fromFontSize = 120; // intro font size
    const toFontSize = 24; // navbar font size

    // Create a clone that we'll animate (original stays hidden)
    const clone = centerLogo.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = fromRect.left + 'px';
    clone.style.top = fromRect.top + 'px';
    clone.style.width = fromRect.width + 'px';
    clone.style.height = fromRect.height + 'px';
    clone.style.margin = '0';
    clone.style.zIndex = '10001';
    clone.style.transform = 'none'; // Reset any transforms
    document.body.appendChild(clone);

    // GSAP timeline for smooth transition
    const tl = gsap.timeline({
      onComplete: () => {
        // Show navbar logo with same text
        navLogo.style.opacity = '1';
        navLogo.style.visibility = 'visible';
        
        // Remove the clone
        clone.remove();

        // Fade out loader
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            if (onLoadComplete) onLoadComplete();
          }
        });
      }
    });

    // Hide original logo immediately
    tl.set(centerLogo, { opacity: 0 }, 0);

    // Hold at 100% briefly
    tl.to({}, { duration: 0.3 });

    // Calculate relative movement (center to center)
    const dx = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
    const dy = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

    // Move clone to navbar position with relative transforms
    tl.to(
      clone,
      {
        x: dx,
        y: dy,
        scale: toFontSize / fromFontSize,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      '-=0.3'
    );

    // Fade out progress bar and loading text
    tl.to(
      [loaderRef.current.querySelector('.progress-container'), loaderRef.current.querySelector('.loading-text')],
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      },
      '-=0.9'
    );
  };

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: 1,
        pointerEvents: 'auto'
      }}
    >
      <div
        id="intro-logo"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <h1
          style={{
            fontSize: '120px',
            fontWeight: '400',
            color: '#ffffff',
            margin: 0,
            fontFamily: "'Zen Antique', serif",
            letterSpacing: '12px',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
          }}
        >
          ADARSH
        </h1>
        
        {/* Progress underline */}
        <div
          className="progress-container"
          style={{
            width: '600px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '1px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            ref={underlineRef}
            style={{
              height: '100%',
              width: '100%',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
              background: '#ffffff',
              borderRadius: '1px',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
          />
        </div>
      </div>

      {/* Progress text (optional) */}
      <div
        className="loading-text"
        style={{
          position: 'absolute',
          bottom: '50px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '11px',
          letterSpacing: '3px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
          fontWeight: '500'
        }}
      >
        LOADING {Math.round(smoothProgress)}%
      </div>
    </div>
  );
};

export default IntroLoader;
