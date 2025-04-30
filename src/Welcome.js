import React from 'react';

// Add floaty animation keyframes to the document if not present
if (typeof document !== 'undefined' && !document.getElementById('floaty-keyframes')) {
  const style = document.createElement('style');
  style.id = 'floaty-keyframes';
  style.innerHTML = `
    @keyframes floaty {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-30px) scale(1.18); }
    }
    @keyframes flask-bounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-12px) scale(1.08); }
    }
    @keyframes borderGlowSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .welcome-flask-anim {
      animation: flask-bounce 2.6s infinite cubic-bezier(.7,0,.3,1.1);
      filter: drop-shadow(0 4px 24px #38bdf8cc);
    }
  `;
  document.head.appendChild(style);
}

export default function Welcome({ onNext }) {
  return (
    <div style={{
      textAlign: 'center',
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 0,
    }}>
      {/* Fullscreen magenta/violet glow background */}
      <div className="global-bg-glow" />
      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 12 + Math.random() * 10,
            height: 12 + Math.random() * 10,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, #38bdf8 60%, transparent 100%)',
            opacity: 0.17 + Math.random() * 0.16,
            filter: 'blur(1.5px)',
            zIndex: 1,
            animation: `floaty 9s linear ${Math.random() * 7}s infinite alternate`,
            pointerEvents: 'none',
          }} />
        ))}
      </div>

      {/* Main Card */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        <div className="glass-card">
          {/* Border glow animation */}
          <div style={{
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            borderRadius: 44,
            zIndex: 4,
            pointerEvents: 'none',
            background: 'conic-gradient(from 0deg, #38bdf8, #a5b4fc, #ff5ca7, #38bdf8)',
            filter: 'blur(14px) brightness(1.5)',
            opacity: 0.35,
            animation: 'borderGlowSpin 7s linear infinite',
          }} />

          {/* Flask Emoji */}
          <div className="welcome-flask-anim" style={{ fontSize: '4.2em', marginBottom: 10 }}>
            🧪
          </div>

          {/* Title */}
          <h2 className="ptable-title" style={{
            letterSpacing: 1.5,
            fontWeight: 900,
            fontSize: '2.2em',
            textShadow: '0 2px 18px #38bdf8bb, 0 1px 0 #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: '#fff',
          }}>
            Welcome to AcingChem!
          </h2>

          {/* Subtitle */}
          <div style={{
            fontSize: '1.13em',
            margin: '12px 0 28px 0',
            color: '#a5b4fc',
            fontWeight: 600,
            textShadow: '0 1px 8px #38bdf8aa',
            letterSpacing: 1,
          }}>
            <span role="img" aria-label="sparkle" style={{ marginRight: 6 }}>✨</span>
            Where chemistry comes alive with color and clarity!
          </div>

          {/* Button */}
          <button
            className="glow-btn"
            onClick={onNext}
          >
            <span role="img" aria-label="start" style={{ marginRight: 10, filter: 'drop-shadow(0 2px 6px #ff5ca7)' }}>🚀</span>
            Start Learning
          </button>
        </div>
      </div>
      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: 0,
        width: '100vw',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.45em',
        fontWeight: 900,
        letterSpacing: 1.2,
        textShadow: '0 2px 18px #38bdf8cc, 0 1px 0 #fff, 0 0 16px #ff5ca7',
        zIndex: 20,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, #38bdf8 0%, #ff5ca7 100%)',
        borderRadius: 18,
        margin: '0 auto',
        padding: '12px 0',
        boxShadow: '0 4px 32px #38bdf8aa, 0 2px 16px #ff5ca7aa',
        maxWidth: 420,
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <span role="img" aria-label="author" style={{marginRight: 8, filter: 'drop-shadow(0 2px 6px #38bdf8)'}}>👨‍🔬</span>
        Created by Adonis Yanez
      </div>
    </div>
  );
}
