import React, { useState } from 'react';

const Skills = () => {
  const [showTechStack, setShowTechStack] = useState(false);

  const techStack = [
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: 'JavaScript', icon: '✨', color: '#F7DF1E' },
    { name: 'Tailwind CSS', icon: '🎨', color: '#06B6D4' },
    { name: 'Three.js', icon: '🎭', color: '#04D9FF' },
    { name: 'Node.js', icon: '⚙️', color: '#68A063' },
    { name: 'MongoDB', icon: '🗄️', color: '#13AA52' },
    { name: 'Express.js', icon: '🚀', color: '#64B5F6' },
    { name: 'GSAP', icon: '✦', color: '#88CE02' },
    { name: 'Vite', icon: '⚡', color: '#646CFF' },
    { name: 'Figma', icon: '🎯', color: '#F24E1E' },
    { name: 'UI/UX Design', icon: '🖌️', color: '#A259FF' },
    { name: 'Web Animation', icon: '🌊', color: '#FF6B6B' },
  ];

  const sponsors = [
    'Zepto',
    'BigBasket',
    'BlackBuck',
    'Discord',
    'Croma',
    'TATA CLiQ',
  ];

  return (
    <div
      id="skills"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
        paddingTop: '0px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section with Watch */}
      <section style={{ padding: '120px 60px 80px 60px', minHeight: '80vh', display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '120px', alignItems: 'center', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
          {/* Left Content */}
          <div>
            <h1
              style={{
                fontSize: '64px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                margin: '0 0 24px 0',
                color: '#ffffff',
              }}
            >
              Skills & <br />Tech Stack
            </h1>
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 32px 0',
                maxWidth: '450px',
              }}
            >
              A comprehensive toolkit of modern technologies and design methodologies crafted for creating exceptional digital experiences.
            </p>
            <button
              onClick={() => setShowTechStack(!showTechStack)}
              style={{
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
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
              {showTechStack ? 'Hide Tech Stack' : 'View Tech Stack →'}
            </button>
          </div>

          {/* Right - Apple Watch Image (Clickable) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              perspective: '1000px',
              cursor: 'pointer',
            }}
            onClick={() => setShowTechStack(!showTechStack)}
          >
            <img
              src="/images/Apple%20Watch%2038mm%20Space%20Gray%20Aluminum%20+%20Black/Volt%20Nike%20Open.svg"
              alt="Apple Watch Tech Stack Display"
              style={{
                width: '100px',
                height: 'auto',
                filter: 'drop-shadow(0 30px 60px rgba(255, 255, 255, 0.1))',
                objectFit: 'contain',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.filter = 'drop-shadow(0 35px 70px rgba(255, 255, 255, 0.15))';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'drop-shadow(0 30px 60px rgba(255, 255, 255, 0.1))';
              }}
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Modal/Section */}
      {showTechStack && (
        <section style={{ padding: '0 60px 80px 60px', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '32px',
              }}
            >
              {techStack.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    padding: '32px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div style={{ fontSize: '44px', marginBottom: '16px' }}>
                    {skill.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0', color: '#ffffff' }}>
                    {skill.name}
                  </h3>
                  <div
                    style={{
                      width: '48px',
                      height: '4px',
                      background: skill.color,
                      borderRadius: '2px',
                      margin: '16px 0 0 0',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 60px' }} />

      {/* Brands and Clients Section */}
      <section style={{ padding: '80px 60px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: '400',
              letterSpacing: '0.02em',
              marginBottom: '60px',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Brands and Clients I worked with
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '60px 40px',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {sponsor}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
};

export default Skills;