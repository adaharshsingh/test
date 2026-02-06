import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const useIsMobile = (query = "(max-width: 768px)") => {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.matchMedia(query).matches);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    }
    mql.addEventListener('change', handleMediaQueryChange);
    return () => {
      mql.removeEventListener('change', handleMediaQueryChange);
    }
  }, [query]);
  
  return isMobile;
}

export default function Projects({ isIntroComplete = true }) {
  const isMobile = useIsMobile();
  const sceneRef = useRef(null);

  const projects = useMemo(() => [
    {
      title: "nk studio",
      subtitle: "Creative Digital Studio",
      link: "https://www.nk.studio/",
      accentColor: "#00d4aa",
      description: "A cutting-edge digital studio crafting immersive web experiences with modern design principles and interactive storytelling.",
      tech: ["React", "Three.js", "GSAP", "WebGL"],
      category: "Web Development",
      year: "2024",
      image: isMobile ? '/images/photo1.JPG' : '/images/project-1.png',
    },
    {
      title: "Gamily",
      subtitle: "Family Connection Platform",
      link: "https://gamilyapp.com/",
      accentColor: "#61DAFB",
      description: "Family-oriented mobile application designed to bring loved ones closer through shared moments and seamless communication.",
      tech: ["React Native", "Node.js", "MongoDB", "Firebase"],
      category: "Mobile App",
      year: "2024",
      image: isMobile ? '/images/photo2.PNG' : '/images/project-2.png',
    },
    {
      title: "Hungry Tiger",
      subtitle: "Food Delivery Experience",
      link: "https://www.eathungrytiger.com/",
      accentColor: "#ffa500",
      description: "Modern food delivery platform reimagining the dining experience with intuitive design and lightning-fast service.",
      tech: ["Next.js", "Tailwind CSS", "Stripe", "Redis"],
      category: "E-commerce",
      year: "2023",
      image: isMobile ? '/images/photo3.png' : '/images/project-3.png',
    },
  ], [isMobile]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [stageOpacity, setStageOpacity] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.min(
      projects.length - 1,
      Math.floor(v * projects.length)
    );
    setActiveIndex(index);

    // Soft entry & exit
    if (v < 0.05) setStageOpacity(v / 0.05);        // fade in
    else if (v > 0.95) setStageOpacity((1 - v) / 0.05); // fade out
    else setStageOpacity(1);
  });

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <>
      {/* Fixed Stage - Always Mounted */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          opacity: stageOpacity,
          transform: `translateY(${(1 - stageOpacity) * 40}px)`,
          transition: 'opacity 0.2s linear, transform 0.2s linear',
          pointerEvents: stageOpacity > 0.01 ? 'auto' : 'none',
        }}
      >
        {projects.map((project, idx) => (
          <div
            key={project.title}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '40px 20px' : '0 60px',
              opacity: activeIndex === idx ? 1 : 0,
              pointerEvents: activeIndex === idx ? 'auto' : 'none',
              transition: 'opacity 0.8s ease',
              zIndex: activeIndex === idx ? 10 : 1,
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: '1600px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
              gap: isMobile ? '60px' : '80px',
              alignItems: 'center',
              position: 'relative',
            }}>

              {/* Left Side - Image with Title Behind */}
              <motion.div
                animate={{ opacity: activeIndex === idx ? 1 : 0, x: activeIndex === idx ? 0 : -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Device Frame - iPad with Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: isMobile ? '16/9' : '16/10',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: `drop-shadow(0 60px 120px ${project.accentColor}40) drop-shadow(0 0 60px ${project.accentColor}30)`,
                  zIndex: 5,
                }}>
                  {/* Project Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      position: 'absolute',
                      width: '90%',
                      height: '97%',
                      objectFit: 'fill',
                      borderRadius: '16px',
                      zIndex: 5,
                    }}
                  />

                  {/* Gradient overlay on image */}
                  <div style={{
                    position: 'absolute',
                    width: '90%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
                    pointerEvents: 'none',
                    borderRadius: '16px',
                    zIndex: 8,
                  }} />

                  {/* Device Bezel (SVG) - On Top */}
                  <img
                    src="/images/Apple iPad Pro 11 Silver - Landscape.svg"
                    alt="Device"
                    style={{
                      position: 'absolute',
                      top: '-19%',
                      width: '140%',
                      height: '140%',
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Title Overlay - Top Left (Behind everything) */}
                  <div style={{
                    position: 'absolute',
                    top: '-18%',
                    left: '-10%',
                    zIndex: 1,
                  }}>
                    <h3 style={{
                      fontSize: isMobile ? '80px' : '140px',
                      fontWeight: '800',
                      letterSpacing: '-0.03em',
                      color: 'rgba(255, 255, 255, 0.12)',
                      margin: 0,
                      lineHeight: '0.9',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
                      textAlign: 'left',
                    }}>
                      {project.title}
                    </h3>
                  </div>

                  {/* Clickable Dot Indicators - Below Image */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '12px',
                    zIndex: 20,
                  }}>
                    {projects.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          const scrollContainer = sceneRef.current;
                          if (scrollContainer) {
                            const targetScroll = (dotIdx / projects.length) * scrollContainer.scrollHeight;
                            window.scrollTo({
                              top: scrollContainer.offsetTop + targetScroll,
                              behavior: 'smooth',
                            });
                          }
                        }}
                        style={{
                          width: activeIndex === dotIdx ? '32px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: activeIndex === dotIdx
                            ? projects[activeIndex].accentColor
                            : 'rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.4s ease',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Project Details */}
              <motion.div
                animate={{ opacity: activeIndex === idx ? 1 : 0, x: activeIndex === idx ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{
                  color: '#ffffff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
                }}
              >
                {/* Category & Year */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: project.accentColor,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {project.category}
                  </span>
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500',
                  }}>
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: isMobile ? '36px' : '52px',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px 0',
                  color: '#ffffff',
                  lineHeight: '1.1',
                }}>
                  {project.title}
                </h2>

                {/* Subtitle */}
                <p style={{
                  fontSize: '20px',
                  color: project.accentColor,
                  margin: '0 0 32px 0',
                  fontWeight: '500',
                }}>
                  {project.subtitle}
                </p>

                {/* Description */}
                <p style={{
                  fontSize: '17px',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0 0 40px 0',
                }}>
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div style={{ marginBottom: '40px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '16px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Tech Stack
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}>
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '10px 18px',
                          fontSize: '14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '500',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={project.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 32px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#000000',
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 16px rgba(255, 255, 255, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 255, 255, 0.15)';
                  }}
                >
                  View Project
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Scroll Indicator - Project Counter */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '80px' : '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}>
            {activeIndex + 1} / {projects.length}
          </p>
        </div>
      </div>

      {/* Scroll Spacer - Controls project transitions */}
      <section
        id="projects"
        style={{
          height: `${projects.length * 100}vh`,
          position: 'relative',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
        }}
        ref={sceneRef}
      />
    </>
  );
} 