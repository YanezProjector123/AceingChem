import React from 'react';

export default function AtomicRadiusMenu({ onSelect, onBack }) {
  return (
    <div className="center-container fade-in slide-up" style={{
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)',
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.98)',
        padding: '32px 24px 24px',
        borderRadius: 18,
        boxShadow: '0 4px 16px #0005',
        minWidth: 260,
        maxWidth: 340,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#fff', marginBottom: 18, fontWeight: 900, letterSpacing: 1.5 }}>Atomic Radius</h2>
        <div style={{ color: '#a5b4fc', fontSize: '1.13em', marginBottom: 26 }}>Choose an assignment type:</div>
        <button className="ptable-btn" style={{ marginBottom: 16, width: '100%' }} onClick={() => onSelect('standard')}>Standard Comparison</button>
        <button className="ptable-btn" style={{ marginBottom: 16, width: '100%' }} onClick={() => onSelect('trend')}>Trend Explorer</button>
        <button className="ptable-btn" style={{ marginBottom: 16, width: '100%' }} onClick={() => onSelect('explanation')}>Explanation & Reflection</button>
        <button className="back-btn" style={{ marginTop: 10, width: '100%' }} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
