import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Connect",
      links: [
        { name: "GitHub", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "Twitter", url: "#" },
        { name: "Email", url: "#" }
      ]
    },
    {
      title: "Explore",
      links: [
        { name: "MacOS App", url: "/mac-app" },
        { name: "Projects", url: "#projects" },
        { name: "Skills", url: "#skills" },
        { name: "Blog", url: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Resume", url: "/files/resume.pdf" },
        { name: "Case Studies", url: "#" },
        { name: "Portfolio", url: "#" },
        { name: "Contact", url: "#" }
      ]
    }
  ];

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Main Footer Content */}
      <div style={{ padding: '80px 60px 40px 60px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px', marginBottom: '60px' }}>
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#ffffff', letterSpacing: '-0.01em' }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} style={{ marginBottom: '12px' }}>
                    <a
                      href={link.url}
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        textDecoration: 'none',
                        fontSize: '15px',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '40px 0' }} />

        {/* Bottom Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'flex-end' }}>
          {/* Left - Branding */}
          <div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}
            >
              Adarsh
            </h2>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px', lineHeight: '1.5' }}>
              Full Stack Developer & UI/UX Designer crafting beautiful digital experiences
            </p>
          </div>

          {/* Right - Copyright & Credits */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 8px 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              © {currentYear} Adarsh. All rights reserved.
            </p>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
              Built with React, Three.js & GSAP
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Footer Bar */}
      <div
        style={{
          padding: '20px 60px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.2)',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center'
        }}
      >
        Designed & Developed with ♡
      </div>
    </footer>
  );
};

export default Footer;
