import React from 'react';

/**
 * HeroText Component
 * 
 * Displays the main hero text with gradient effects using SVG filters
 * - Multi-layer glow effects
 * - Rainbow gradient coloring
 * - Blur and shadow effects for depth
 */
function HeroText({ containerRef }) {
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
        overflow: 'visible',
        padding: '100px'
      }}
    >
      {/* Subtitle */}
      <h2
        style={{
          fontSize: '3rem',
          fontWeight: '570',
          color: '#ffffff',
          margin: '0 0 -30px 0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '0.5px',
          opacity: 0.9
        }}
      >
        Hi, I am
      </h2>

      {/* Main Name with SVG Effects */}
      <svg
        width="1400"
        height="240"
        viewBox="0 0 1400 240"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '90vw', height: 'auto', overflow: 'visible', display: 'block' }}
      >
        <defs>
          {/* Rainbow Gradient */}
          <linearGradient id="edgeGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="20%" stopColor="#0099ff" />
            <stop offset="40%" stopColor="#6666ff" />
            <stop offset="60%" stopColor="#ff00ff" />
            <stop offset="80%" stopColor="#ff3366" />
            <stop offset="100%" stopColor="#ffaa00" />
          </linearGradient>

          {/* Outer Glow Filter */}
          <filter id="outerGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="60" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1.5 0 0 0 0
                      0 1.5 0 0 0
                      0 0 1.5 0 0
                      0 0 0 2 0"
              result="brighterBlur"
            />
            <feMerge>
              <feMergeNode in="brighterBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner Glow Filter */}
          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="in" result="inner" />
            <feMerge>
              <feMergeNode in="inner" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Maximum Diffused Glow */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="url(#edgeGradient)"
          opacity="1"
          filter="url(#outerGlow)"
        >
          Adarsh Singh
        </text>

        {/* Layer 2: Medium Blur */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="url(#edgeGradient)"
          opacity="1"
          style={{ filter: 'blur(40px)' }}
        >
          Adarsh Singh
        </text>

        {/* Layer 3: Light Blur */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="url(#edgeGradient)"
          opacity="0.9"
          style={{ filter: 'blur(25px)' }}
        >
          Adarsh Singh
        </text>

        {/* Layer 4: Color Edge Bleed */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="url(#edgeGradient)"
          opacity="1"
          filter="url(#innerGlow)"
        >
          Adarsh Singh
        </text>

        {/* Layer 5: Soft Blur */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="url(#edgeGradient)"
          opacity="0.8"
          style={{ filter: 'blur(8px)' }}
        >
          Adarsh Singh
        </text>

        {/* Layer 6: White Core */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="120"
          fontFamily="Inter, SF Pro Display, Poppins, Arial, sans-serif"
          fontWeight="600"
          fill="white"
        >
          Adarsh Singh
        </text>
      </svg>
    </div>
  );
}

export default HeroText;
