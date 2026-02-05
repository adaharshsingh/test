import React from 'react';

const Skills = () => {
  const skills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'Three.js', level: 85 },
    { name: 'GSAP', level: 80 },
    { name: 'Node.js', level: 85 },
    { name: 'CSS/Tailwind', level: 90 },
    { name: 'Python', level: 75 },
    { name: 'TypeScript', level: 80 },
  ];

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '80px 5%',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Skills Title */}
      <h2
        style={{
          fontSize: '4rem',
          fontWeight: '700',
          textAlign: 'center',
          margin: '0 0 60px 0',
          background: 'linear-gradient(135deg, #00ffff, #ff00ff, #ffaa00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        My Skills
      </h2>

      {/* Skills Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}
      >
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Skill Name */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: 0,
                  color: '#ffffff'
                }}
              >
                {skill.name}
              </h3>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {skill.level}%
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${skill.level}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div
        style={{
          marginTop: '80px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '80px auto 0'
        }}
      >
        <p
          style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}
        >
          Passionate about creating innovative web experiences with modern technologies.
          Always learning and exploring new tools to bring ideas to life.
        </p>
      </div>
    </div>
  );
};

export default Skills;