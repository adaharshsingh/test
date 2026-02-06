import React, { useRef, useEffect, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// ========================================
// SCROLL TIMELINE CONSTANTS
// ========================================
const SCROLL = {
  LID_OPEN_END: 1000,      // 0-1000px: Lid opens from 4° to 90°
  HOLD_START: 1000,        // 1000-1500px: Hold with M3 wallpaper (brief)
  HOLD_END: 1500,
  ABOUT_ME_START: 1500,    // 1500px: Mac moves left, About Me appears
  ABOUT_ME_END: 2500,      // 2500px: About Me fully visible (1000px duration)
  EXIT_START: 2500,        // 2500-3500px: Fast exit animations (Mac disappears quickly)
  EXIT_END: 3500,
  SKILLS_START: 3500,      // 3500px: Skills section appears after Mac is gone
};

/**
 * MacModel Component - Simplified Timeline-Based
 * 
 * Pure scroll-driven animations:
 * - 0-1000px: Lid opens, rainbow → M3 wallpaper
 * - 1000-1500px: Mac centered with M3 wallpaper (brief)
 * - 1500-4500px: Mac moves left, About Me appears (long duration)
 * - 4500-5500px: Exit animations, Skills transitions up
 * - 5500px+: Skills section full view
 */
function MacModel({ textContainerRef, aboutMeRef, skillsRef, startAnimation = true, onInitialAnimationComplete }) {
  const { scene } = useGLTF('/models/mac.glb');
  const macRef = useRef();
  const groupRef = useRef();
  const lidRef = useRef();
  const screenRef = useRef();
  const lightsRef = useRef([]);
  const studioLightsRef = useRef([]);
  
  // Animation values stored in refs
  const initialRotationRef = useRef(null);
  const initialPositionYRef = useRef(null);
  const fullyOpenRef = useRef(null);
  const openTo4DegreesRef = useRef(null);
  const m3TextureRef = useRef(null);
  const rainbowTextureRef = useRef(null);
  const hasAppliedM3Ref = useRef(false);
  const isAnimatingRef = useRef(false);
  const animationStartedRef = useRef(false);

  // ========================================
  // MAIN SETUP & SCROLL HANDLER
  // ========================================
  useEffect(() => {
    if (!scene) return;

    let macLid = null;
    const allScreenMeshes = [];
    
    // Find lid and screen meshes
    scene.traverse((child) => {
      if (child.name === 'mac_lid' || child.name.toLowerCase().includes('lid')) {
        macLid = child;
        lidRef.current = child;
      }
      
      if (child.isMesh && child.name === 'Object_36_5') {
        allScreenMeshes.push(child);
        screenRef.current = child;
        child.updateMatrixWorld(true);
      }
    });

    if (!macLid) return;

    // Store initial values
    const initialClosedRotation = macLid.rotation.x;
    initialRotationRef.current = initialClosedRotation;
    
    const openTo4Degrees = initialClosedRotation - (4 * Math.PI) / 180;
    openTo4DegreesRef.current = openTo4Degrees;
    
    const fullyOpen = initialClosedRotation - (90 * Math.PI) / 180;
    fullyOpenRef.current = fullyOpen;
    
    const initialPositionY = macLid.position.y;
    initialPositionYRef.current = initialPositionY;

    // ========================================
    // INITIAL 4-DEGREE OPENING ANIMATION
    // ========================================
    if (!startAnimation || animationStartedRef.current) {
      return; // Don't start animation if loader is still showing or already started
    }

    animationStartedRef.current = true;

    const timeline = gsap.timeline({ 
      delay: 0.5,
      onStart: () => {
        isAnimatingRef.current = true;
        document.body.style.overflow = 'hidden';
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        document.body.style.overflow = 'auto';
        if (onInitialAnimationComplete) {
          onInitialAnimationComplete();
        }
      }
    });
    
    timeline.to(macLid.rotation, {
      x: openTo4Degrees,
      duration: 2,
      ease: 'power2.inOut'
    }, 0);
    
    timeline.to(macLid.position, {
      y: initialPositionY + 0.02,
      duration: 2,
      ease: 'power2.inOut'
    }, 0);

    // ========================================
    // APPLY RAINBOW GRADIENT TO SCREEN
    // ========================================
    if (allScreenMeshes.length > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#00ffff');
      gradient.addColorStop(0.15, '#0080ff');
      gradient.addColorStop(0.3, '#aa00ff');
      gradient.addColorStop(0.45, '#ff00ff');
      gradient.addColorStop(0.6, '#ff0055');
      gradient.addColorStop(0.8, '#ff6600');
      gradient.addColorStop(1, '#ffff00');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const rainbowTexture = new THREE.CanvasTexture(canvas);
      rainbowTexture.magFilter = THREE.LinearFilter;
      rainbowTexture.minFilter = THREE.LinearFilter;
      rainbowTextureRef.current = rainbowTexture;
      
      allScreenMeshes.forEach(mesh => {
        if (mesh.material) {
          mesh.material.emissive.setHex(0xffffff);
          mesh.material.emissiveMap = rainbowTexture;
          mesh.material.emissiveIntensity = 5;
          mesh.material.toneMapped = false;
          mesh.material.color.setHex(0xffffff);
          mesh.material.needsUpdate = true;
        }
      });
      
      // Animate rainbow intensity
      timeline.to({ intensity: 5 }, {
        intensity: 8,
        duration: 2,
        onUpdate: function() {
          allScreenMeshes.forEach(mesh => {
            if (mesh.material) {
              mesh.material.emissiveIntensity = this.targets()[0].intensity;
              mesh.material.needsUpdate = true;
            }
          });
        }
      }, 0);
      
      // Load M3 wallpaper
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/images/M3-MacBook-Pro-Wallpaper-8K.png', (m3Texture) => {
        m3Texture.magFilter = THREE.LinearFilter;
        m3Texture.minFilter = THREE.LinearFilter;
        m3TextureRef.current = m3Texture;
      });
    }

    // ========================================
    // SCROLL HANDLER - PURE TIMELINE BASED
    // ========================================
    const handleScroll = () => {
      if (!lidRef.current || isAnimatingRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Calculate progress for each phase
      const lidProgress = Math.min(scrollY / SCROLL.LID_OPEN_END, 1);
      const aboutMeProgress = Math.min(Math.max((scrollY - SCROLL.ABOUT_ME_START) / (SCROLL.ABOUT_ME_END - SCROLL.ABOUT_ME_START), 0), 1);
      const exitProgress = Math.min(Math.max((scrollY - SCROLL.EXIT_START) / (SCROLL.EXIT_END - SCROLL.EXIT_START), 0), 1);

      // ========================================
      // PHASE 1: LID OPENING (0-1000px)
      // ========================================
      const targetRotation = openTo4DegreesRef.current - (lidProgress * (openTo4DegreesRef.current - fullyOpenRef.current));
      const targetPositionY = (initialPositionYRef.current + 0.02) + (lidProgress * 0.18);
      
      lidRef.current.rotation.x = targetRotation;
      lidRef.current.position.y = targetPositionY;
      
      if (macRef.current) {
        macRef.current.position.y = -0.8 + (lidProgress * -0.2);
      }
      
      // Switch to M3 wallpaper on first scroll
      if (scrollY > 10 && !hasAppliedM3Ref.current && m3TextureRef.current && screenRef.current) {
        hasAppliedM3Ref.current = true;
        
        screenRef.current.material.map = m3TextureRef.current;
        screenRef.current.material.emissiveMap = m3TextureRef.current;
        screenRef.current.material.emissiveIntensity = 1.2;
        screenRef.current.material.emissive.setHex(0xffffff);
        screenRef.current.material.toneMapped = false;
        screenRef.current.material.needsUpdate = true;
        
        // Enable studio lights
        studioLightsRef.current.forEach(light => {
          if (light && light.userData.targetIntensity) {
            light.intensity = light.userData.targetIntensity;
          }
        });
        
        // Fade out keyboard lights
        lightsRef.current.forEach(light => {
          if (light) {
            gsap.to(light, { intensity: 0, duration: 0.5 });
          }
        });
      }
      
      // Revert to rainbow gradient when scrolling back (before scroll reaches 10px)
      if (scrollY < 10 && hasAppliedM3Ref.current && rainbowTextureRef.current && screenRef.current) {
        hasAppliedM3Ref.current = false;
        
        screenRef.current.material.map = rainbowTextureRef.current;
        screenRef.current.material.emissiveMap = rainbowTextureRef.current;
        screenRef.current.material.emissiveIntensity = 6 + (3.5 * lidProgress);
        screenRef.current.material.emissive.setHex(0xffffff);
        screenRef.current.material.toneMapped = false;
        screenRef.current.material.needsUpdate = true;
        
        // Fade keyboard lights back in
        lightsRef.current.forEach(light => {
          if (light) {
            gsap.to(light, { intensity: 1, duration: 0.5 });
          }
        });
      }
      
      // Text fade based on lid progress
      if (textContainerRef?.current) {
        const textDisappearProgress = 23 / 86;
        const textFadeProgress = Math.min(lidProgress / textDisappearProgress, 1);
        const textOpacity = Math.max(0, 1 - textFadeProgress);
        
        // Keep translateX(-50%) to maintain centering while adding translateY
        textContainerRef.current.style.transform = `translateX(-50%) translateY(-${lidProgress * 300}px)`;
        textContainerRef.current.style.opacity = textOpacity;
      }

      // ========================================
      // PHASE 2: ABOUT ME TRANSITION (1500-4500px)
      // ========================================
      if (scrollY >= SCROLL.ABOUT_ME_START && scrollY < SCROLL.EXIT_START && groupRef.current) {
        // Interpolate Mac position from center to left
        const macX = -1 * aboutMeProgress;
        const macY = -0.1 * aboutMeProgress;
        
        groupRef.current.position.x = macX;
        groupRef.current.position.y = macY;
        groupRef.current.position.z = 0;
        
        // Ensure rotation is reset (no tilt during About Me phase)
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = 0;
      }
      
      // About Me opacity (only visible during about me and exit phases)
      if (aboutMeRef?.current) {
        if (scrollY >= SCROLL.ABOUT_ME_START) {
          // During About Me and Exit phases
          aboutMeRef.current.style.opacity = Math.min(aboutMeProgress, Math.max(0, 1 - exitProgress));
          aboutMeRef.current.style.transform = `translateX(${600 * exitProgress}px) translateY(-50%)`;
        } else {
          // Before About Me starts - completely hidden
          aboutMeRef.current.style.opacity = 0;
          aboutMeRef.current.style.transform = `translateX(0) translateY(-50%)`;
        }
      }

      // ========================================
      // PHASE 3: EXIT ANIMATIONS (2500-3500px)
      // ========================================
      if (scrollY >= SCROLL.EXIT_START && groupRef.current) {
        // Mac rotates out to the left (no scaling)
        groupRef.current.position.x = -1 + (-7 * exitProgress);
        groupRef.current.position.y = -0.1 - (0.9 * exitProgress);
        groupRef.current.position.z = -3 * exitProgress;
        groupRef.current.rotation.y = -(Math.PI / 2) * exitProgress;
        groupRef.current.rotation.z = -(Math.PI / 6) * exitProgress;
        
        // Skills section appears only after Mac nearly disappears
        if (skillsRef?.current) {
          // Show skills very late - only after Mac is almost completely gone
          const skillsShowProgress = Math.max(0, (exitProgress - 0.85) * 6.67);
          skillsRef.current.style.top = `${100 - (100 * skillsShowProgress)}vh`;
          skillsRef.current.style.opacity = skillsShowProgress;
        }
      } else if (scrollY < SCROLL.EXIT_START && skillsRef?.current) {
        // Reset skills position and opacity before exit phase
        skillsRef.current.style.top = `100vh`;
        skillsRef.current.style.opacity = 0;
      }
      
      // Full reset when scrolling back before About Me
      if (scrollY < SCROLL.ABOUT_ME_START && groupRef.current) {
        groupRef.current.position.set(0, 0, 0);
        groupRef.current.rotation.set(0, 0, 0);
        groupRef.current.scale.set(1, 1, 1);
        
        // Reset About Me
        if (aboutMeRef?.current) {
          aboutMeRef.current.style.opacity = 0;
          aboutMeRef.current.style.transform = `translateX(0) translateY(-50%)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      timeline.kill();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scene, textContainerRef, aboutMeRef, skillsRef, startAnimation, onInitialAnimationComplete]);

  // ========================================
  // RENDER
  // ========================================
  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <group
          ref={macRef}
          position={[0, -0.8, 0]}
          rotation={[-0.417, 0, 0]}
          scale={14}
        >
          <primitive object={scene} />
        </group>
      </group>
      
      {/* Studio Lights - start at 0, enabled on scroll */}
      <ambientLight 
        ref={el => {
          if (el) {
            el.userData.targetIntensity = 2.5;
            studioLightsRef.current[0] = el;
          }
        }}
        intensity={0} 
        color="#ffffff" 
      />
      <directionalLight 
        ref={el => {
          if (el) {
            el.userData.targetIntensity = 3;
            studioLightsRef.current[1] = el;
          }
        }}
        position={[8, 6, -3]} 
        intensity={0} 
        color="#ffffff" 
      />
      <directionalLight 
        ref={el => {
          if (el) {
            el.userData.targetIntensity = 2;
            studioLightsRef.current[2] = el;
          }
        }}
        position={[-8, 4, -6]} 
        intensity={0} 
        color="#ffffff" 
      />
      <pointLight 
        ref={el => {
          if (el) {
            el.userData.targetIntensity = 4;
            studioLightsRef.current[3] = el;
          }
        }}
        position={[0, 6, -8]} 
        intensity={0} 
        color="#ffffff" 
      />

      {/* Keyboard Glow Lights */}
      <pointLight 
        ref={el => lightsRef.current[0] = el}
        position={[-1, 1, 0.6]} 
        intensity={8} 
        distance={12}
        color="#00ffff"
      />
      <pointLight 
        ref={el => lightsRef.current[1] = el}
        position={[0, 1.3, 0.8]} 
        intensity={8} 
        distance={12}
        color="#ff00ff"
      />
      <pointLight 
        ref={el => lightsRef.current[2] = el}
        position={[1, 1, 0.6]} 
        intensity={8} 
        distance={12}
        color="#ffaa00"
      />
      <spotLight
        ref={el => lightsRef.current[3] = el}
        position={[0, 1.5, 0.9]}
        angle={1.4}
        penumbra={0.5}
        intensity={8}
        color="#ffffff"
        target-position={[0, -2.5, 0]}
      />
      <rectAreaLight
        ref={el => lightsRef.current[4] = el}
        position={[0, 0.8, 0.4]}
        width={8}
        height={5}
        intensity={4}
        color="#ffccff"
      />
      
      {/* Rainbow Gradient Lights */}
      <pointLight 
        ref={el => lightsRef.current[5] = el}
        position={[-2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#00ffff"
      />
      <pointLight 
        ref={el => lightsRef.current[6] = el}
        position={[-1.2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#0080ff"
      />
      <pointLight 
        ref={el => lightsRef.current[7] = el}
        position={[-0.4, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#aa00ff"
      />
      <pointLight 
        ref={el => lightsRef.current[8] = el}
        position={[0, 0.5, 0]} 
        intensity={30} 
        distance={10}
        color="#ff00ff"
      />
      <pointLight 
        ref={el => lightsRef.current[9] = el}
        position={[0.4, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ff0055"
      />
      <pointLight 
        ref={el => lightsRef.current[10] = el}
        position={[1.2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ff6600"
      />
      <pointLight 
        ref={el => lightsRef.current[11] = el}
        position={[2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ffff00"
      />
      
      <rectAreaLight
        ref={el => lightsRef.current[12] = el}
        position={[0, 1, 0.2]}
        width={8}
        height={4}
        intensity={15}
        color="#ffffff"
      />
      <pointLight 
        ref={el => lightsRef.current[13] = el}
        position={[0, -1, 1]} 
        intensity={20} 
        distance={6}
        color="#aabbff"
      />
    </>
  );
}

// Preload model
useGLTF.preload('/models/mac.glb');

export default MacModel;
