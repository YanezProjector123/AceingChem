import React, { useState } from 'react';

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
  const [showUpdateLog, setShowUpdateLog] = useState(false);
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

          {/* Update Log Button */}
          <button
            className="glow-btn"
            style={{
              marginTop: 22,
              background: 'linear-gradient(90deg, #a5b4fc 0%, #38bdf8 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.06em',
              letterSpacing: 1.1,
              border: 'none',
              borderRadius: 18,
              boxShadow: '0 2px 18px #38bdf8cc, 0 1px 0 #fff',
              padding: '13px 32px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
              filter: 'drop-shadow(0 2px 12px #a5b4fc99)',
              zIndex: 10,
            }}
            onClick={() => setShowUpdateLog(true)}
          >
            <span role="img" aria-label="log" style={{ marginRight: 9, filter: 'drop-shadow(0 2px 6px #38bdf8)' }}>📝</span>
            Update Log
          </button>

        </div> {/* End glass-card */}
      </div> {/* End Main Card Wrapper */}

      {/* Update Log Modal rendered at root for correct stacking */}
      {showUpdateLog && (
        <div style={{ /* ... modal background styles ... */
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24, 30, 48, 0.75)', backdropFilter: 'blur(8px) saturate(1.2)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s'
        }}>
          <div style={{ /* ... modal content styles ... */
            background: 'linear-gradient(135deg, #1e293b 60%, #0f172a 100%)', // Darker gradient
            borderRadius: 28, // Slightly smaller radius
            boxShadow: '0 10px 50px #38bdf866, 0 4px 20px #a5b4fc55',
            padding: '34px 30px 28px 30px', // Adjusted padding
            maxWidth: 480, // Increased max width slightly
            width: '90vw',
            textAlign: 'left',
            position: 'relative',
            border: '2px solid #60a5fa', // Different border color
            color: '#e2e8f0', // Lighter text color
            fontSize: '1.03em', // Base font size
            fontWeight: 500, // Normal weight for list items
            lineHeight: 1.65, // Slightly increased line height
            textShadow: '0 1px 2px #00000044',
            animation: 'popIn 0.35s cubic-bezier(.25,1.5,.5,1)' // Add pop animation
          }}>
            <button
              onClick={() => setShowUpdateLog(false)}
              style={{ /* ... close button styles ... */
                position: 'absolute', top: 12, right: 15, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 30, cursor: 'pointer', textShadow: '0 0 4px #0009', lineHeight: 1, padding: '0 5px'
              }}
              aria-label="Close update log"
            >
              ×
            </button>

            <h3 style={{ /* ... update log title style ... */
              textAlign: 'center', marginTop: 0, marginBottom: '20px', color: '#facc15', // Bright title color
              fontWeight: 700, letterSpacing: 1.2, fontSize: '1.3em', textShadow: '0 1px 3px #0006'
             }}>
              Latest Updates! <span role="img" aria-label="tada">🎉</span>
            </h3>

             {/* --- UPDATED LOG CONTENT --- */}
             <ul style={{ paddingLeft: '20px', margin: 0, listStyle: 'none' }}> {/* Remove default bullets */}
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                   <span role="img" aria-label="sparkles" style={{ marginRight: '10px', marginTop:'2px', color: '#facc15', fontSize: '1.1em'}}>✨</span>
                   <span><b>Major Visual Update:</b> Every activity now has a unique, educational, and engaging style! Each screen is more vibrant and learning-friendly, with its own color palette and highlights.</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                   <span role="img" aria-label="table" style={{ marginRight: '10px', marginTop:'2px', color: '#38bdf8', fontSize: '1.1em'}}>🧪</span>
                   <span><b>Periodic Table Modal:</b> Improved modal overlays in all activities. Only the intended buttons show, and both "Close" and "Back" are now functional where present.</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                   <span role="img" aria-label="broom" style={{ marginRight: '10px', marginTop:'2px', color: '#a5b4fc', fontSize: '1.1em'}}>🧹</span>
                   <span><b>UI Cleanup:</b> Removed stray UI fragments (like "// End Main Fragment") from all screens for a cleaner experience.</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                   <span role="img" aria-label="rocket" style={{ marginRight: '10px', marginTop:'2px', color: '#5eead4', fontSize: '1.1em'}}>🚀</span>
                   <span>All previous activities and bug fixes remain, with even more polish and stability improvements!</span>
                </li>
             </ul>
            {/* --- END OF UPDATED LOG CONTENT --- */}

          </div> {/* End modal content div */}
        </div> // End modal background div
      )}

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        maxWidth: '90%',
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
        padding: '12px 25px',
        boxShadow: '0 4px 32px #38bdf8aa, 0 2px 16px #ff5ca7aa',
      }}>
        <span role="img" aria-label="author" style={{marginRight: 8, filter: 'drop-shadow(0 2px 6px #38bdf8)'}}>👨‍🔬</span>
        Created by Adonis Yanez
      </div>
    </div>
  );
}