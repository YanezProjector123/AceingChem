import React from 'react';

const polyatomicIons = [
  { name: 'Ammonium', formula: 'NH₄⁺', charge: '+1' },
  { name: 'Acetate', formula: 'C₂H₃O₂⁻', charge: '-1' },
  { name: 'Bicarbonate (Hydrogen carbonate)', formula: 'HCO₃⁻', charge: '-1' },
  { name: 'Carbonate', formula: 'CO₃²⁻', charge: '-2' },
  { name: 'Chlorate', formula: 'ClO₃⁻', charge: '-1' },
  { name: 'Chlorite', formula: 'ClO₂⁻', charge: '-1' },
  { name: 'Chromate', formula: 'CrO₄²⁻', charge: '-2' },
  { name: 'Cyanide', formula: 'CN⁻', charge: '-1' },
  { name: 'Dichromate', formula: 'Cr₂O₇²⁻', charge: '-2' },
  { name: 'Hydroxide', formula: 'OH⁻', charge: '-1' },
  { name: 'Nitrate', formula: 'NO₃⁻', charge: '-1' },
  { name: 'Nitrite', formula: 'NO₂⁻', charge: '-1' },
  { name: 'Permanganate', formula: 'MnO₄⁻', charge: '-1' },
  { name: 'Perchlorate', formula: 'ClO₄⁻', charge: '-1' },
  { name: 'Phosphate', formula: 'PO₄³⁻', charge: '-3' },
  { name: 'Phosphite', formula: 'PO₃³⁻', charge: '-3' },
  { name: 'Sulfate', formula: 'SO₄²⁻', charge: '-2' },
  { name: 'Sulfite', formula: 'SO₃²⁻', charge: '-2' },
  { name: 'Thiosulfate', formula: 'S₂O₃²⁻', charge: '-2' },
];

export default function PolyatomicIonReference({ onClose }) {
  return (
    <div style={{ maxWidth: 400, width: '95vw', background: 'rgba(40,40,80,0.97)', borderRadius: 16, boxShadow: '0 4px 32px #b6f8e055', padding: 18, margin: '0 auto', color: '#e0e7ff', fontSize: '1.08em', position: 'relative' }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: 1.2 }}>Common Polyatomic Ions</h3>
      <div style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1em' }}>
          <thead>
            <tr style={{ background: 'rgba(182,248,224,0.10)' }}>
              <th style={{ padding: 6, borderBottom: '1.5px solid #b6f8e0', fontWeight: 600 }}>Name</th>
              <th style={{ padding: 6, borderBottom: '1.5px solid #b6f8e0', fontWeight: 600 }}>Formula</th>
              <th style={{ padding: 6, borderBottom: '1.5px solid #b6f8e0', fontWeight: 600 }}>Charge</th>
            </tr>
          </thead>
          <tbody>
            {polyatomicIons.map((ion, idx) => (
              <tr key={ion.name} style={{ background: idx % 2 ? 'rgba(182,248,224,0.04)' : 'none' }}>
                <td style={{ padding: 6 }}>{ion.name}</td>
                <td style={{ padding: 6, fontFamily: 'monospace', fontWeight: 600 }}>{ion.formula}</td>
                <td style={{ padding: 6 }}>{ion.charge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="ptable-btn" style={{ marginTop: 8, width: '100%' }} onClick={onClose}>Close</button>
    </div>
  );
} 