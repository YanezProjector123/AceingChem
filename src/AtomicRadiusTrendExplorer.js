import React, { useState } from 'react';
import elementsData from './periodic-table.json';

export default function AtomicRadiusTrendExplorer({ onBack }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="center-container fade-in slide-up" style={{ minHeight: '100vh', textAlign: 'center', background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)' }}>
      <div style={{ background: 'rgba(30,41,59,0.98)', padding: 24, borderRadius: 18, boxShadow: '0 4px 16px #0005', maxWidth: 540, margin: '0 auto' }}>
        <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: 1.5 }}>Atomic Radius Trend Explorer</h2>
        <div style={{ color: '#a5b4fc', marginBottom: 18 }}>Click an element to see its atomic radius.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 8, margin: '0 auto', maxWidth: 420 }}>
          {elementsData.map(el => (
            <button key={el.symbol} style={{ background: selected === el.symbol ? '#38bdf8' : '#23234a', color: '#fff', borderRadius: 8, padding: 8, fontWeight: 600, border: 'none', fontSize: '1em', boxShadow: selected === el.symbol ? '0 0 12px #38bdf8' : '0 1px 6px #23234a55', cursor: 'pointer' }} onClick={() => setSelected(el.symbol)}>
              {el.symbol}
            </button>
          ))}
        </div>
        {selected && (
          <div style={{ marginTop: 22, color: '#fff', fontWeight: 700, fontSize: '1.15em' }}>
            {selected}: {elementsData.find(e => e.symbol === selected).atomicRadius} pm
          </div>
        )}
        <button className="back-btn" style={{ marginTop: 24 }} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
