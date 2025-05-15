import React, { useState } from 'react';

export default function CombinedGasLawActivity({ onBack }) {
  const [P1, setP1] = useState('');
  const [V1, setV1] = useState('');
  const [T1, setT1] = useState('');
  const [P2, setP2] = useState('');
  const [V2, setV2] = useState('');
  const [T2, setT2] = useState('');
  const [solveFor, setSolveFor] = useState('P2');
  const [result, setResult] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    let val = '';
    try {
      if (solveFor === 'P2') val = (P1 * V1 * T2 / (T1 * V2)).toFixed(3) + ' atm';
      else if (solveFor === 'V2') val = (P1 * V1 * T2 / (T1 * P2)).toFixed(3) + ' L';
      else if (solveFor === 'T2') val = (P2 * V2 * T1 / (P1 * V1)).toFixed(2) + ' K';
      setResult(val);
    } catch (err) {
      setResult('Calculation error');
    }
  };

  return (
    <div className="activity-container gas-law-activity">
      <h2>Combined Gas Law Practice</h2>
      <form onSubmit={handleCalculate} style={{marginBottom:16}}>
        <div style={{marginBottom:8}}>
          <label>Solve for: </label>
          <select value={solveFor} onChange={e => setSolveFor(e.target.value)}>
            <option value="P2">Final Pressure (P₂)</option>
            <option value="V2">Final Volume (V₂)</option>
            <option value="T2">Final Temperature (T₂)</option>
          </select>
        </div>
        <input type="number" step="any" required placeholder="P₁ (atm)" value={P1} onChange={e=>setP1(e.target.value)} />
        <input type="number" step="any" required placeholder="V₁ (L)" value={V1} onChange={e=>setV1(e.target.value)} />
        <input type="number" step="any" required placeholder="T₁ (K)" value={T1} onChange={e=>setT1(e.target.value)} />
        {solveFor === 'P2' && <input type="number" step="any" required placeholder="V₂ (L)" value={V2} onChange={e=>setV2(e.target.value)} />}
        {solveFor === 'P2' && <input type="number" step="any" required placeholder="T₂ (K)" value={T2} onChange={e=>setT2(e.target.value)} />}
        {solveFor === 'V2' && <input type="number" step="any" required placeholder="P₂ (atm)" value={P2} onChange={e=>setP2(e.target.value)} />}
        {solveFor === 'V2' && <input type="number" step="any" required placeholder="T₂ (K)" value={T2} onChange={e=>setT2(e.target.value)} />}
        {solveFor === 'T2' && <input type="number" step="any" required placeholder="P₂ (atm)" value={P2} onChange={e=>setP2(e.target.value)} />}
        {solveFor === 'T2' && <input type="number" step="any" required placeholder="V₂ (L)" value={V2} onChange={e=>setV2(e.target.value)} />}
        <button type="submit" style={{marginLeft:12}}>Calculate</button>
      </form>
      {result && <div style={{fontWeight:600, fontSize:'1.1em'}}>Result: {result}</div>}
      <button onClick={onBack} style={{marginTop:18}}>Back</button>
    </div>
  );
}
