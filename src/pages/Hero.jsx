import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MacModel from '../components/three/MacModel';
import HeroText from '../components/hero/HeroText';
import ScrollInstructions from '../components/hero/ScrollInstructions';
import About from './About';
import Skills from './Skills';

/**
 * Hero Component - Main Portfolio Landing Page
 * 
 * Features:
 * - 3D MacBook with interactive lid opening animation
 * - Pure scroll-based timeline (0-1000px: lid, 3000-4000px: About Me, 4000-5000px: Exit)
 * - M3 wallpaper on screen after initial opening
 * - Gradient text with SVG effects
 * - Smooth scroll-driven animations
 * 
 * Animation Flow:
 * 1. Initial: 4-degree opening (2s, scroll disabled)
 * 2. Scroll 0-1000px: Lid opens to 90°, rainbow → M3 wallpaper
 * 3. Scroll 1000-3000px: Mac centered with M3 wallpaper
 * 4. Scroll 3000-4000px: Mac moves left, About Me appears
 * 5. Scroll 4000-5000px: Exit animations, Skills appears
 */
export default function Hero() {
  const textContainerRef = useRef(null);
  const aboutMeRef = useRef(null);
  const skillsRef = useRef(null);

  const handleInitialAnimationComplete = () => {
    // Animation complete
  };

  return (
    <div style={{ width: '100vw', minHeight: '500vh', background: '#000' }}>
      {/* Fixed 3D Canvas Container */}
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0 }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }} style={{ background: '#0a0a0a' }}>
          {/* Basic Lights */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} />

          {/* MacBook 3D Model */}
          <MacModel
            textContainerRef={textContainerRef}
            aboutMeRef={aboutMeRef}
            skillsRef={skillsRef}
            onInitialAnimationComplete={handleInitialAnimationComplete}
          />

          {/* Orbit Controls (disabled) */}
          <OrbitControls
            enablePan={false}
            enableRotate={false}
            enableZoom={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Hero Text with Gradient */}
      <HeroText containerRef={textContainerRef} />

      {/* Scroll Instructions */}
      <ScrollInstructions />

      {/* About Me Section */}
      <About aboutMeRef={aboutMeRef} />

      {/* Skills Section */}
      <div
        ref={skillsRef}
        style={{
          position: 'fixed',
          top: '100vh',
          left: 0,
          width: '100vw',
          minHeight: '100vh',
          zIndex: 5,
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <Skills />
      </div>

      {/* Spacer for scrolling - adjusted for shorter timeline */}
      <div style={{ height: '500vh' }} />
    </div>
  );
}
