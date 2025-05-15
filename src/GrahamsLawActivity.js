import React, { useState } from 'react';

export default function GrahamsLawActivity({ onBack }) {
  const [molarMass1, setMolarMass1] = useState('');
  const [molarMass2, setMolarMass2] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    try {
      const rateRatio = Math.sqrt(parseFloat(molarMass2) / parseFloat(molarMass1));
      setResult('Rate₁/Rate₂ = ' + rateRatio.toFixed(3));
    } catch (err) {
      setResult('Calculation error');
    }
  };

  return (
    <div className="activity-container gas-law-activity">
      <h2>Graham's Law of Effusion</h2>
      <form onSubmit={handleCalculate} style={{marginBottom:16}}>
        <input type="number" step="any" required placeholder="Molar Mass 1 (g/mol)" value={molarMass1} onChange={e=>setMolarMass1(e.target.value)} />
        <input type="number" step="any" required placeholder="Molar Mass 2 (g/mol)" value={molarMass2} onChange={e=>setMolarMass2(e.target.value)} />
        <button type="submit" style={{marginLeft:12}}>Calculate Rate Ratio</button>
      </form>
      {result && <div style={{fontWeight:600, fontSize:'1.1em'}}>Result: {result}</div>}
      <button onClick={onBack} style={{marginTop:18}}>Back</button>
    </div>
  );
}
