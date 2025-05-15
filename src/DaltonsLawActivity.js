import React, { useState } from 'react';

export default function DaltonsLawActivity({ onBack }) {
  const [pressures, setPressures] = useState(['']);
  const [result, setResult] = useState('');

  const handleChange = (idx, value) => {
    const newPressures = [...pressures];
    newPressures[idx] = value;
    setPressures(newPressures);
  };

  const handleAdd = () => setPressures([...pressures, '']);
  const handleRemove = (idx) => setPressures(pressures.filter((_, i) => i !== idx));

  const handleCalculate = (e) => {
    e.preventDefault();
    const total = pressures.reduce((sum, p) => sum + parseFloat(p || 0), 0);
    setResult(total.toFixed(3) + ' atm');
  };

  return (
    <div className="activity-container gas-law-activity">
      <h2>Dalton's Law of Partial Pressures</h2>
      <form onSubmit={handleCalculate} style={{marginBottom:16}}>
        {pressures.map((p, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',marginBottom:6}}>
            <input type="number" step="any" required placeholder={`Gas ${i+1} Pressure (atm)`} value={p} onChange={e=>handleChange(i,e.target.value)} />
            {pressures.length > 1 && <button type="button" onClick={()=>handleRemove(i)} style={{marginLeft:6}}>Remove</button>}
          </div>
        ))}
        <button type="button" onClick={handleAdd} style={{marginBottom:8}}>Add Gas</button>
        <button type="submit" style={{marginLeft:12}}>Calculate Total Pressure</button>
      </form>
      {result && <div style={{fontWeight:600, fontSize:'1.1em'}}>Total Pressure: {result}</div>}
      <button onClick={onBack} style={{marginTop:18}}>Back</button>
    </div>
  );
}
