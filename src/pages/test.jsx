import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import MacApp from '../mac-app/App';
import '../mac-app/index.css';

// Mac Model Component with open lid animation
function MacModel({ textContainerRef, aboutMeRef, onInitialAnimationComplete, showMacScreen, setShowMacInterface }) {
  const { scene } = useGLTF('/models/mac.glb');
  const macRef = useRef();
  const groupRef = useRef(); // Wrapper group for proper pivot
  const lidRef = useRef();
  const screenRef = useRef();
  const screenMeshRef = useRef(); // Store the screen mesh node
  const htmlAttachedRef = useRef(false); // Ensure anchor created only once
  const [htmlReady, setHtmlReady] = useState(false); // NEW: Signal when Html can render
  const [animationStarted, setAnimationStarted] = useState(false); // State for animation trigger to force re-render
  const initialRotationRef = useRef(null);
  const targetOpenRotationRef = useRef(null);
  const lockTriggeredRef = useRef(false); // Persist across renders
  const hasScrolledRef = useRef(false); // Track if user has scrolled
  const macAnimationStartedRef = useRef(false); // Track if Mac animation to About Me has started
  const wallpaperTextureRef = useRef(null); // Store wallpaper texture
  const lightsRef = useRef([]); // Store light references
  const studioLightsRef = useRef([]); // Store studio light references
  const lidAnimationCompleteRef = useRef(false); // Track if lid animation is done
  const isAnimatingRef = useRef(false); // Track if 4-degree animation is in progress

  // FIX 1: On initial load, check if already scrolled past open point (reload detection)
  useEffect(() => {
    const scrollY = window.scrollY;
    const maxScroll = 1000;

    if (scrollY / maxScroll >= 0.95) {
      console.log('🔁 Reload detected past open point — restoring Mac screen');
      lockTriggeredRef.current = true;
      setShowMacInterface(true);
    }
  }, [setShowMacInterface]);

  // FIX 3: Reset htmlAttachedRef when showMacScreen state changes
  useEffect(() => {
    if (!showMacScreen) {
      htmlAttachedRef.current = false;
    }
  }, [showMacScreen]);

  useEffect(() => {
    if (!scene) return;

    // Find the mac_lid and screen objects
    let macLid = null;
    const allScreenMeshes = [];
    
    console.log('=== Searching for Mac parts ===');
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log('Mesh found:', child.name, 'Material:', child.material?.type);
      }
      if (child.isGroup || child.isObject3D) {
        console.log('Group/Object found:', child.name);
      }
      
      // Look for mac_lid specifically
      if (child.name === 'mac_lid' || child.name.toLowerCase().includes('mac_lid') || child.name.toLowerCase().includes('lid')) {
        macLid = child;
        lidRef.current = child;
        console.log('✓ Found mac_lid!', child);
      }
      
      // Target Object_36_5 (the other MeshPhysicalMaterial - likely the screen display)
      if (child.isMesh && child.name === 'Object_36_5') {
        console.log('✓ Found screen display mesh!', child.name, child.material.type);
        allScreenMeshes.push(child);
        screenRef.current = child;
        screenMeshRef.current = child; // Store the mesh node
        
        // IMPORTANT: ensure matrix updates
        child.updateMatrixWorld(true);
      }
    });
    
    console.log('Mac lid found:', !!macLid, 'Screen meshes found:', allScreenMeshes.length);

    if (macLid) {
      console.log('Initial rotation:', macLid.rotation.x, macLid.rotation.y, macLid.rotation.z);
      console.log('Initial position:', macLid.position.x, macLid.position.y, macLid.position.z);
      
      // Store initial closed rotation
      const initialClosedRotation = macLid.rotation.x;
      initialRotationRef.current = initialClosedRotation;
      
      // Calculate 4 degree open position (in radians) - subtract to open
      const openTo4Degrees = initialClosedRotation - (4 * Math.PI) / 180;
      targetOpenRotationRef.current = openTo4Degrees;
      
      // Calculate full open position (90 degrees from initial)
      const fullyOpen = initialClosedRotation - (90 * Math.PI) / 180;
      
      const initialPositionY = macLid.position.y;
      
      // Open lid animation on load - open to 4 degrees
      const timeline = gsap.timeline({ 
        delay: 0.5,
        onStart: () => {
          isAnimatingRef.current = true;
          // Disable scroll during animation
          document.body.style.overflow = 'hidden';
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          lidAnimationCompleteRef.current = true;
          // Re-enable scroll after animation
          document.body.style.overflow = 'auto';
          // Trigger Mac interface display after 4-degree opening completes
          if (onInitialAnimationComplete) {
            onInitialAnimationComplete();
          }
        }
      });
      timeline.to(macLid.rotation, {
        x: openTo4Degrees, // Open to 4 degrees
        duration: 2,
        ease: 'power2.inOut'
      }, 0);
      
      // Lift the lid slightly while opening
      timeline.to(macLid.position, {
        y: initialPositionY + 0.02,
        duration: 2,
        ease: 'power2.inOut'
      }, 0);
      
      // Apply rainbow gradient to screen on initial load
      if (allScreenMeshes.length > 0) {
        console.log('Applying rainbow gradient to', allScreenMeshes.length, 'screen meshes');
        
        // Create a canvas texture with rainbow gradient
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create horizontal rainbow gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#00ffff');    // Cyan
        gradient.addColorStop(0.15, '#0080ff'); // Blue
        gradient.addColorStop(0.3, '#aa00ff');  // Purple
        gradient.addColorStop(0.45, '#ff00ff'); // Magenta
        gradient.addColorStop(0.6, '#ff0055');  // Red
        gradient.addColorStop(0.8, '#ff6600');  // Orange
        gradient.addColorStop(1, '#ffff00');    // Yellow
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        
        // Apply gradient as emissive map
        allScreenMeshes.forEach(mesh => {
          if (mesh.material) {
            mesh.material.emissive.setHex(0xffffff);
            mesh.material.emissiveMap = texture;
            mesh.material.emissiveIntensity = 5;
            mesh.material.toneMapped = false;
            mesh.material.color.setHex(0xffffff);
            mesh.material.needsUpdate = true;
            console.log('Applied rainbow gradient to screen');
          }
        });
        
        // Preload M3 wallpaper texture for later use
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/images/M3-MacBook-Pro-Wallpaper-8K.png', (wallpaperTexture) => {
          console.log('M3 Wallpaper preloaded successfully');
          wallpaperTexture.magFilter = THREE.LinearFilter;
          wallpaperTexture.minFilter = THREE.LinearFilter;
          wallpaperTextureRef.current = wallpaperTexture;
        }, undefined, (error) => {
          console.warn('Failed to load M3 wallpaper:', error);
        });
        
        // Pulse the intensity during opening
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
      } else {
        console.warn('No screen meshes found!');
      }

      // Scroll handler to open the lid and move text up
      const handleScroll = () => {
        if (!lidRef.current || initialRotationRef.current === null) return;
        
        // On first scroll, replace gradient with wallpaper and turn off keyboard lights
        if (!hasScrolledRef.current && screenRef.current) {
          hasScrolledRef.current = true;
          console.log('First scroll - replacing gradient with wallpaper and turning off keyboard lights');
          
          // Replace gradient with wallpaper
          if (wallpaperTextureRef.current) {
            screenRef.current.material.map = wallpaperTextureRef.current;
            screenRef.current.material.emissiveMap = wallpaperTextureRef.current;
            screenRef.current.material.emissiveIntensity = 1.2; // Increased screen brightness
            screenRef.current.material.emissive.setHex(0xffffff);
            screenRef.current.material.toneMapped = false;
            screenRef.current.material.needsUpdate = true;
            console.log('Wallpaper applied to screen');
          }
          
          // Enable studio lights
          studioLightsRef.current.forEach(light => {
            if (light) {
              light.intensity = light.userData.targetIntensity || 1;
            }
          });
          console.log('Studio lights enabled');
        }
        
        // Get scroll position
        const scrollY = window.scrollY;
        const maxScroll = 1000; // Max scroll distance to fully open
        
        // Calculate rotation based on scroll (0 = 4 degrees, max scroll = fully open)
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // Debug: log only when close to or at max scroll
        if (scrollProgress > 0.9) {
          console.log(`📊 scrollY: ${scrollY}, scrollProgress: ${scrollProgress.toFixed(3)}, lockTriggered: ${lockTriggeredRef.current}`);
        }
        
        // Only drive the scroll-controlled animation if lid hasn't fully opened yet
        if (!lockTriggeredRef.current) {
          const targetRotation = openTo4Degrees - (scrollProgress * (openTo4Degrees - fullyOpen));
          const targetPositionY = (initialPositionY + 0.02) + (scrollProgress * 0.18); // Lift more as it opens
          
          gsap.to(lidRef.current.rotation, {
            x: targetRotation,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          gsap.to(lidRef.current.position, {
            y: targetPositionY,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          // Move mac down as lid opens
          gsap.to(macRef.current.position, {
            y: -0.8 + (scrollProgress * -0.2),
            duration: 0.3,
            ease: 'power2.out'
          });
          
          // Animate text upward and fade out on scroll
          if (textContainerRef?.current) {
            // Text should fully disappear when lid opens to 27 degrees
            // That's 23 degrees into opening (27 - 4 = 23 out of 86 total)
            // So text disappears at scrollProgress ≈ 0.267
            const textDisappearProgress = 23 / 86; // Degrees opened / total degrees to open
            const textFadeProgress = Math.min(scrollProgress / textDisappearProgress, 1);
            const textMoveDistance = scrollProgress * 300; // Move up 300px
            const textOpacity = Math.max(0, 1 - textFadeProgress); // Fade out completely by 27 degrees
            
            // Fade out keyboard lights as text disappears
            lightsRef.current.forEach(light => {
              if (light) {
                light.intensity = Math.max(0, 8 * (1 - textFadeProgress)); // Fade from 8 to 0
              }
            });
            
            gsap.to(textContainerRef.current, {
              y: -textMoveDistance,
              opacity: textOpacity,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
        
        // Trigger animation when lid fully opens (only trigger once)
        if (scrollProgress >= 0.95 && !lockTriggeredRef.current) {
          console.log('🎬 Lid fully opened! Showing Mac OS Portfolio');
          lockTriggeredRef.current = true;
          
          // Show Mac OS Portfolio overlay
          if (setShowMacInterface) {
            setShowMacInterface(true);
          }
        }
        
        // Animate Mac to About Me section after 2 scroll heights (scrollY >= 3000)
        // This is 2000px more scrolling after lid opens at 1000px
        if (scrollY >= 2900) {
          // Start hiding overlay as we approach animation point
          if (htmlReady) {
            setHtmlReady(false);
          }
        }
        
        if (scrollY >= 3000 && !macAnimationStartedRef.current) {
          console.log('🎯 Starting Mac animation to About Me section');
          macAnimationStartedRef.current = true;
          setAnimationStarted(true); // Trigger re-render to hide Html overlay
          
          // Apply M3 wallpaper as Three.js texture on screen mesh
          if (wallpaperTextureRef.current && screenRef.current) {
            console.log('📱 Applying M3 wallpaper as screen texture');
            screenRef.current.material.map = wallpaperTextureRef.current;
            screenRef.current.material.emissiveMap = wallpaperTextureRef.current;
            screenRef.current.material.emissiveIntensity = 1.2;
            screenRef.current.material.emissive.setHex(0xffffff);
            screenRef.current.material.toneMapped = false;
            screenRef.current.material.needsUpdate = true;
          }
          
          // Animate mac and group to About Me position
          gsap.to(groupRef.current.position, {
            x: -1,
            y: -0.1,
            z: 0,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => console.log('✓ Mac moved to About Me position')
          });
          
          gsap.to(groupRef.current.rotation, {
            y: 0,
            duration: 2,
            ease: 'power2.inOut'
          });
          
          // Show about me text
          if (aboutMeRef.current) {
            console.log('📝 Showing About Me text');
            gsap.to(aboutMeRef.current, {
              opacity: 1,
              duration: 1.5,
              delay: 1.5,
              ease: 'power2.out'
            });
            
            gsap.fromTo(aboutMeRef.current, 
              { scale: 0.8 },
              {
                scale: 1,
                duration: 1.5,
                delay: 1.5,
                ease: 'back.out'
              }
            );
            
            gsap.fromTo(aboutMeRef.current,
              { rotation: -5 },
              {
                rotation: 0,
                duration: 1.5,
                delay: 1.5,
                ease: 'power2.out'
              }
            );
          }
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        timeline.kill();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scene, textContainerRef, aboutMeRef, onInitialAnimationComplete, setShowMacInterface]);

  // Separate effect to attach Html anchor when Mac interface should show
  useEffect(() => {
    if (showMacScreen && screenMeshRef.current && !htmlAttachedRef.current) {
      htmlAttachedRef.current = true;
      console.log('🎯 Creating Html anchor for screen mesh');

      const screenMesh = screenMeshRef.current;
      
      // Create anchor WITHOUT clearing material yet
      const anchor = new THREE.Object3D();
      anchor.position.set(0, 0.51, 0.01);
      anchor.rotation.set(-0.43, 0, 0);  // ← Add this line if you want rotation

      screenMesh.add(anchor);
      screenMesh.userData.htmlAnchor = anchor;

      console.log('✓ Html anchor attached to screen mesh');
      
      // Signal that Html can now render
      setHtmlReady(true);
    }
  }, [showMacScreen]);

  // NEW: Clear material ONLY AFTER Html is confirmed ready
  useEffect(() => {
    if (htmlReady && screenMeshRef.current) {
      const screenMesh = screenMeshRef.current;
      const mat = screenMesh.material;
      
      if (mat) {
        console.log('Clearing screen material (after Html ready)...');
        mat.map = null;
        mat.emissiveMap = null;
        mat.emissiveIntensity = 0;
        mat.color.set('#000000');
        mat.needsUpdate = true;
      }
    }
  }, [htmlReady]);

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
      
      {/* Attach Html to screen anchor - only render when htmlReady */}
      {screenMeshRef.current?.userData?.htmlAnchor && htmlReady && !animationStarted && (
        <Html
          transform
          object={screenMeshRef.current.userData.htmlAnchor}
          scale={[0.0627, 0.0649, 1]}
        >
          <div
            style={{
              width: '1920px',
              height: '1200px',
              background: '#111',
              pointerEvents: 'auto',
              margin: 0,
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {htmlReady && lidAnimationCompleteRef.current ? (
              <MacApp />
            ) : (
              <img
                src="/images/M3-MacBook-Pro-Wallpaper-8K.png"
                alt="MacBook Wallpaper"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            )}
          </div>
        </Html>
      )}
    </group>
      
      {/* Studio lights - start at 0, enabled on scroll */}
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

      {/* ULTRA BRIGHT screen glow that floods keyboard with color */}
      {/* Cyan glow */}
      <pointLight 
        ref={el => lightsRef.current[0] = el}
        position={[-1, 1, 0.6]} 
        intensity={8} 
        distance={12}
        color="#00ffff"
      />
      {/* Magenta glow */}
      <pointLight 
        ref={el => lightsRef.current[1] = el}
        position={[0, 1.3, 0.8]} 
        intensity={8} 
        distance={12}
        color="#ff00ff"
      />
      {/* Orange/Yellow glow */}
      <pointLight 
        ref={el => lightsRef.current[2] = el}
        position={[1, 1, 0.6]} 
        intensity={8} 
        distance={12}
        color="#ffaa00"
      />
      {/* Direct spotlight from screen flooding keyboard */}
      <spotLight
        ref={el => lightsRef.current[3] = el}
        position={[0, 1.5, 0.9]}
        angle={1.4}
        penumbra={0.5}
        intensity={8}
        color="#ffffff"
        target-position={[0, -2.5, 0]}
      />
      {/* Huge area light spreading rainbow */}
      <rectAreaLight
        ref={el => lightsRef.current[4] = el}
        position={[0, 0.8, 0.4]}
        width={8}
        height={5}
        intensity={4}
        color="#ffccff"
      />
      
      {/* HIDDEN SOFT ILLUMINATION - Rainbow gradient lighting across keyboard */}
      {/* Cyan light - left side */}
      <pointLight 
        ref={el => lightsRef.current[5] = el}
        position={[-2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#00ffff"
      />
      {/* Blue light */}
      <pointLight 
        ref={el => lightsRef.current[6] = el}
        position={[-1.2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#0080ff"
      />
      {/* Purple light */}
      <pointLight 
        ref={el => lightsRef.current[7] = el}
        position={[-0.4, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#aa00ff"
      />
      {/* Magenta light - center */}
      <pointLight 
        ref={el => lightsRef.current[8] = el}
        position={[0, 0.5, 0]} 
        intensity={30} 
        distance={10}
        color="#ff00ff"
      />
      {/* Red light */}
      <pointLight 
        ref={el => lightsRef.current[9] = el}
        position={[0.4, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ff0055"
      />
      {/* Orange light */}
      <pointLight 
        ref={el => lightsRef.current[10] = el}
        position={[1.2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ff6600"
      />
      {/* Yellow light - right side */}
      <pointLight 
        ref={el => lightsRef.current[11] = el}
        position={[2, 0.5, 0]} 
        intensity={25} 
        distance={10}
        color="#ffff00"
      />
      
      {/* Wide soft area light for smooth gradient blending */}
      <rectAreaLight
        ref={el => lightsRef.current[12] = el}
        position={[0, 1, 0.2]}
        width={8}
        height={4}
        intensity={15}
        color="#ffffff"
      />
      {/* Secondary point light from below for rim lighting */}
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

// Main Test Component
export default function Test() {
  const textContainerRef = React.useRef(null);
  const aboutMeRef = React.useRef(null);
  const [showMacInterface, setShowMacInterface] = useState(false);

  const handleInitialAnimationComplete = () => {
    console.log('4-degree opening complete');
  };
  
  return (
    <div style={{ width: '100vw', minHeight: '500vh', background: '#000' }}>
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0 }}>
        <Canvas
          camera={{ position: [0, 2, 5], fov: 45 }}
          style={{ background: '#0a0a0a' }}
        >
          {/* Lights */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} />

          {/* Mac Model */}
          <MacModel 
            textContainerRef={textContainerRef} 
            aboutMeRef={aboutMeRef} 
            onInitialAnimationComplete={handleInitialAnimationComplete}
            showMacScreen={showMacInterface}
          setShowMacInterface={setShowMacInterface}
            enablePan={false}
            enableRotate={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Gradient Text Above Mac with SVG-style effects */}
      <div ref={textContainerRef} style={{
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center',
        overflow: 'visible',
        padding: '100px'
      }}>
        {/* Subtitle */}
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '570',
          color: '#ffffff',
          margin: '0 0 -30px 0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '0.5px',
          opacity: 0.9
        }}>
          Hi, I am
        </h2>
        
        {/* Main Name */}
        <svg width="1400" height="240" viewBox="0 0 1400 240" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '90vw', height: 'auto', overflow: 'visible', display: 'block' }}>
          <defs>
            {/* Color gradient for edges & glow - ultra vibrant */}
            <linearGradient id="edgeGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#00ffff"/>
              <stop offset="20%" stopColor="#0099ff"/>
              <stop offset="40%" stopColor="#6666ff"/>
              <stop offset="60%" stopColor="#ff00ff"/>
              <stop offset="80%" stopColor="#ff3366"/>
              <stop offset="100%" stopColor="#ffaa00"/>
            </linearGradient>

            {/* Massive outer glow */}
            <filter id="outerGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="60" result="blur"/>
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
                <feMergeNode in="brighterBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Inner color bleed - very intense */}
            <filter id="innerGlow">
              <feGaussianBlur stdDeviation="15" result="blur"/>
              <feComposite
                in="blur"
                in2="SourceGraphic"
                operator="in"
                result="inner"
              />
              <feMerge>
                <feMergeNode in="inner"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* OUTER GLOW - Layer 1 (maximum diffused) */}
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

          {/* OUTER GLOW - Layer 2 */}
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

          {/* OUTER GLOW - Layer 3 */}
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

          {/* COLOR EDGE BLEED - Layer 1 */}
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

          {/* COLOR EDGE BLEED - Layer 2 */}
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

          {/* WHITE CORE */}
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

      {/* Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '1rem',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>Scroll to open the MacBook ↓</p>
      </div>

      {/* About Me Section */}
      <div ref={aboutMeRef} style={{
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
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: '600',
          margin: '0 0 20px 0',
          background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          About Me
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '0',
          fontWeight: '400'
        }}>
          I'm a passionate developer creating innovative digital experiences. Crafting beautiful code and stunning interfaces.
        </p>
      </div>

      {/* Spacer for scrolling */}
      <div style={{ height: '400vh' }} />
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/mac.glb');
