import React, { useState } from 'react';
import './BoylesLawActivity.css';

export default function BoylesLawActivity({ onBack, onShowPeriodicTable }) {
  const [P1, setP1] = useState('');
  const [V1, setV1] = useState('');
  const [P2, setP2] = useState('');
  const [V2, setV2] = useState('');
  const [solveFor, setSolveFor] = useState('P2');
  const [result, setResult] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    let val = '';
    try {
      if (solveFor === 'P2') val = (P1 * V1 / V2).toFixed(3) + ' atm';
      else if (solveFor === 'V2') val = (P1 * V1 / P2).toFixed(3) + ' L';
      setResult(val);
    } catch (err) {
      setResult('Calculation error');
    }
  };

  return (
    <div className="boyle-root">
      <div className="boyle-title">Boyle's Law</div>
      <div className="boyle-card">
        <form className="boyle-form" onSubmit={handleCalculate}>
          <div className="boyle-input-row">
            <label>Solve for: </label>
            <select className="boyle-input" value={solveFor} onChange={e=>setSolveFor(e.target.value)}>
              <option value="P2">Solve for P₂</option>
              <option value="V2">Solve for V₂</option>
            </select>
          </div>
          <input className="boyle-input" type="number" step="any" required placeholder="P₁ (atm)" value={P1} onChange={e=>setP1(e.target.value)} />
          <input className="boyle-input" type="number" step="any" required placeholder="V₁ (L)" value={V1} onChange={e=>setV1(e.target.value)} />
          {solveFor === 'P2' && <input className="boyle-input" type="number" step="any" required placeholder="V₂ (L)" value={V2} onChange={e=>setV2(e.target.value)} />}
          {solveFor === 'V2' && <input className="boyle-input" type="number" step="any" required placeholder="P₂ (atm)" value={P2} onChange={e=>setP2(e.target.value)} />}
          <button className="boyle-btn" type="submit">Calculate</button>
        </form>
        {result && <div className="boyle-feedback">Result: {result}</div>}
      </div>
      <div className="boyle-action-row">
        <button className="boyle-back-btn" onClick={onBack}>Back</button>
        <button className="boyle-ptable-btn" onClick={onShowPeriodicTable}>Periodic Table</button>
      </div>
    </div>
  );
}
