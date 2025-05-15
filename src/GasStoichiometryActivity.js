import React, { useState } from 'react';

export default function GasStoichiometryActivity({ onBack }) {
  const [volume, setVolume] = useState('');
  const [moles, setMoles] = useState('');
  const [result, setResult] = useState('');
  const [direction, setDirection] = useState('V2n');

  const handleCalculate = (e) => {
    e.preventDefault();
    try {
      if (direction === 'V2n') {
        setResult((volume / 22.4).toFixed(3) + ' mol (at STP)');
      } else {
        setResult((moles * 22.4).toFixed(3) + ' L (at STP)');
      }
    } catch (err) {
      setResult('Calculation error');
    }
  };

  return (
    <div className="activity-container gas-law-activity">
      <h2>Gas Stoichiometry (at STP)</h2>
      <form onSubmit={handleCalculate} style={{marginBottom:16}}>
        <div style={{marginBottom:8}}>
          <label>Convert:</label>
          <select value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="V2n">Volume (L) → Moles (n)</option>
            <option value="n2V">Moles (n) → Volume (L)</option>
          </select>
        </div>
        {direction === 'V2n' && <input type="number" step="any" required placeholder="Volume (L)" value={volume} onChange={e=>setVolume(e.target.value)} />}
        {direction === 'n2V' && <input type="number" step="any" required placeholder="Moles (n)" value={moles} onChange={e=>setMoles(e.target.value)} />}
        <button type="submit" style={{marginLeft:12}}>Calculate</button>
      </form>
      {result && <div style={{fontWeight:600, fontSize:'1.1em'}}>Result: {result}</div>}
      <button onClick={onBack} style={{marginTop:18}}>Back</button>
    </div>
  );
}
