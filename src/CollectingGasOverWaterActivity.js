import React, { useState } from 'react';

export default function CollectingGasOverWaterActivity({ onBack }) {
  const [totalPressure, setTotalPressure] = useState('');
  const [vaporPressure, setVaporPressure] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    try {
      const dryGasPressure = parseFloat(totalPressure) - parseFloat(vaporPressure);
      setResult('Dry Gas Pressure: ' + dryGasPressure.toFixed(3) + ' atm');
    } catch (err) {
      setResult('Calculation error');
    }
  };

  return (
    <div className="activity-container gas-law-activity">
      <h2>Collecting Gas Over Water</h2>
      <form onSubmit={handleCalculate} style={{marginBottom:16}}>
        <input type="number" step="any" required placeholder="Total Pressure (atm)" value={totalPressure} onChange={e=>setTotalPressure(e.target.value)} />
        <input type="number" step="any" required placeholder="Vapor Pressure of Water (atm)" value={vaporPressure} onChange={e=>setVaporPressure(e.target.value)} />
        <button type="submit" style={{marginLeft:12}}>Calculate Dry Gas Pressure</button>
      </form>
      {result && <div style={{fontWeight:600, fontSize:'1.1em'}}>{result}</div>}
      <button onClick={onBack} style={{marginTop:18}}>Back</button>
    </div>
  );
}
