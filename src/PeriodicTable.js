import React, { useState, useEffect } from 'react';
import './PeriodicTable.css';
import elementsData from './periodic-table.json';

const CATEGORY_COLORS = {
  'alkali-metal': 'alkali',
  'alkaline-earth-metal': 'alkaline',
  'transition-metal': 'transition',
  'post-transition-metal': 'post-transition',
  'metalloid': 'metalloid',
  'nonmetal': 'nonmetal',
  'halogen': 'halogen',
  'noble-gas': 'noble',
  'lanthanide': 'lanthanide',
  'actinide': 'actinide',
};

// React.memo is used to prevent unnecessary re-renders of the PeriodicTable, which can be a heavy component.
const PeriodicTable = ({ onBack }) => {
  const [selected, setSelected] = useState(null);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    setElements(elementsData);
  }, []);

  // Lanthanides and actinides (period 6 and 7, group 3)
  const lanthanides = elements.filter(e => e.category === 'lanthanide');
  const actinides = elements.filter(e => e.category === 'actinide');

  return (
    <div className="ptable-outer" style={{ width: '100vw', minHeight: '100vh', margin: 0, background: 'linear-gradient(120deg,#2d1436 0,#1e0030 100%)', boxShadow: 'none', borderRadius: 0, padding: '40px 0 24px 0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button className="ptable-btn" style={{ marginBottom: 18, background: 'linear-gradient(90deg,#c9b6f8 0,#b6f8e0 100%)', color: '#23234a', fontWeight: 800, borderRadius: 10, fontSize: '1.15em', padding: '10px 28px', boxShadow: '0 2px 10px #b6f8e055', border: '1.5px solid #b6f8e0', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }} onClick={onBack}>Back</button>
      </div>
      <h2 className="ptable-title">Periodic Table</h2>
      <p className="ptable-desc">Each color represents a different group of elements. See the legend below for details.</p>
      <div className="ptable-legend">
        <span className="ptable-legend-item alkali">Alkali Metal</span>
        <span className="ptable-legend-item alkaline">Alkaline Earth</span>
        <span className="ptable-legend-item transition">Transition Metal</span>
        <span className="ptable-legend-item post-transition">Post-Transition</span>
        <span className="ptable-legend-item metalloid">Metalloid</span>
        <span className="ptable-legend-item nonmetal">Nonmetal</span>
        <span className="ptable-legend-item halogen">Halogen</span>
        <span className="ptable-legend-item noble">Noble Gas</span>
        <span className="ptable-legend-item lanthanide">Lanthanide</span>
        <span className="ptable-legend-item actinide">Actinide</span>
      </div>
      <div className="periodic-table-grid">
  {elements.filter(el => el.category !== 'lanthanide' && el.category !== 'actinide').map(el => (
    <div
      key={el.number}
      className={`periodic-table-cell ${CATEGORY_COLORS[el.category]}`}
      style={{ gridColumn: el.group, gridRow: el.period }}
      onClick={() => setSelected(el)}
    >
      <span className="ptable-atomic-number">{el.number}</span>
<span className="ptable-symbol">{el.symbol}</span>
<span className="ptable-name">{el.name}</span>
    </div>
  ))}
</div>


      {/* Lanthanides */}
      <div className="lanth-act-row">
        <div className="lanth-act-grid">
          {lanthanides.map(el => (
            <div
              key={el.number}
              className={`periodic-table-cell lanthanide`}
              onClick={() => setSelected(el)}
            >
              <span className="ptable-atomic-number">{el.number}</span>
              <span className="ptable-symbol">{el.symbol}</span>
              
              <span className="ptable-name">{el.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Actinides */}
      <div className="lanth-act-row">
        <div className="lanth-act-grid">
          {actinides.map(el => (
            <div
              key={el.number}
              className={`periodic-table-cell actinide`}
              onClick={() => setSelected(el)}
            >
              <span className="ptable-atomic-number">{el.number}</span>
              <span className="ptable-symbol">{el.symbol}</span>
              
              <span className="ptable-name">{el.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Info panel */}
      {selected && (
        <div className="ptable-modal" onClick={() => setSelected(null)}>
          <div className="ptable-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-info" onClick={() => setSelected(null)}>×</button>
            <h3 className="ptable-modal-header">{selected.name} <span>({selected.symbol})</span></h3>
            <div className="ptable-modal-details">
              <span><strong>Atomic Number:</strong> {selected.number ?? 'Unknown'}</span><br/>
              <span><strong>Symbol:</strong> {selected.symbol ?? 'Unknown'}</span><br/>
              <span><strong>Name:</strong> {selected.name ?? 'Unknown'}</span><br/>
              
              <span><strong>Category:</strong> {selected.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ?? 'Unknown'}</span><br/>
              <span><strong>Group:</strong> {selected.group ?? 'Unknown'}</span><br/>
              <span><strong>Period:</strong> {selected.period ?? 'Unknown'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PeriodicTable);
