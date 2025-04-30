import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';

// Demo problems for Ionic Name to Formula
function getRandomIonicNameToFormulaProblem() {
  const problems = [
    // Alkali metals (Group 1)
    { name: 'Lithium fluoride', answer: 'LiF', explanation: '' },
    { name: 'Rubidium fluoride', answer: 'RbF', explanation: '' },
    { name: 'Rubidium chloride', answer: 'RbCl', explanation: '' },
    { name: 'Rubidium bromide', answer: 'RbBr', explanation: '' },
    { name: 'Rubidium iodide', answer: 'RbI', explanation: '' },
    { name: 'Rubidium oxide', answer: 'Rb₂O', explanation: '' },
    { name: 'Rubidium sulfide', answer: 'Rb₂S', explanation: '' },
    { name: 'Rubidium nitride', answer: 'Rb₃N', explanation: '' },
    { name: 'Cesium fluoride', answer: 'CsF', explanation: '' },
    { name: 'Cesium chloride', answer: 'CsCl', explanation: '' },
    { name: 'Cesium bromide', answer: 'CsBr', explanation: '' },
    { name: 'Cesium iodide', answer: 'CsI', explanation: '' },
    { name: 'Cesium oxide', answer: 'Cs₂O', explanation: '' },
    { name: 'Cesium sulfide', answer: 'Cs₂S', explanation: '' },
    { name: 'Cesium nitride', answer: 'Cs₃N', explanation: '' },
    { name: 'Francium fluoride', answer: 'FrF', explanation: '' },
    { name: 'Francium chloride', answer: 'FrCl', explanation: '' },
    { name: 'Francium bromide', answer: 'FrBr', explanation: '' },
    { name: 'Francium iodide', answer: 'FrI', explanation: '' },
    { name: 'Francium oxide', answer: 'Fr₂O', explanation: '' },
    { name: 'Francium sulfide', answer: 'Fr₂S', explanation: '' },
    { name: 'Francium nitride', answer: 'Fr₃N', explanation: '' },
    { name: 'Lithium chloride', answer: 'LiCl', explanation: '' },
    { name: 'Lithium bromide', answer: 'LiBr', explanation: '' },
    { name: 'Lithium iodide', answer: 'LiI', explanation: '' },
    { name: 'Lithium oxide', answer: 'Li₂O', explanation: '' },
    { name: 'Lithium sulfide', answer: 'Li₂S', explanation: '' },
    { name: 'Lithium nitride', answer: 'Li₃N', explanation: '' },
    { name: 'Sodium fluoride', answer: 'NaF', explanation: '' },
    { name: 'Sodium chloride', answer: 'NaCl', explanation: '' },
    { name: 'Sodium bromide', answer: 'NaBr', explanation: '' },
    { name: 'Sodium iodide', answer: 'NaI', explanation: '' },
    { name: 'Sodium oxide', answer: 'Na₂O', explanation: '' },
    { name: 'Sodium sulfide', answer: 'Na₂S', explanation: '' },
    { name: 'Sodium nitride', answer: 'Na₃N', explanation: '' },
    { name: 'Potassium fluoride', answer: 'KF', explanation: '' },
    { name: 'Potassium chloride', answer: 'KCl', explanation: '' },
    { name: 'Potassium bromide', answer: 'KBr', explanation: '' },
    { name: 'Potassium iodide', answer: 'KI', explanation: '' },
    { name: 'Potassium oxide', answer: 'K₂O', explanation: '' },
    { name: 'Potassium sulfide', answer: 'K₂S', explanation: '' },
    { name: 'Potassium nitride', answer: 'K₃N', explanation: '' },
    // Alkaline earth metals (Group 2)
    { name: 'Radium fluoride', answer: 'RaF₂', explanation: '' },
    { name: 'Radium chloride', answer: 'RaCl₂', explanation: '' },
    { name: 'Radium bromide', answer: 'RaBr₂', explanation: '' },
    { name: 'Radium iodide', answer: 'RaI₂', explanation: '' },
    { name: 'Radium oxide', answer: 'RaO', explanation: '' },
    { name: 'Radium sulfide', answer: 'RaS', explanation: '' },
    { name: 'Radium nitride', answer: 'Ra₃N₂', explanation: '' },
    { name: 'Magnesium fluoride', answer: 'MgF₂', explanation: '' },
    { name: 'Magnesium chloride', answer: 'MgCl₂', explanation: '' },
    { name: 'Magnesium bromide', answer: 'MgBr₂', explanation: '' },
    { name: 'Magnesium iodide', answer: 'MgI₂', explanation: '' },
    { name: 'Magnesium oxide', answer: 'MgO', explanation: '' },
    { name: 'Magnesium sulfide', answer: 'MgS', explanation: '' },
    { name: 'Magnesium nitride', answer: 'Mg₃N₂', explanation: '' },
    { name: 'Calcium fluoride', answer: 'CaF₂', explanation: '' },
    { name: 'Calcium chloride', answer: 'CaCl₂', explanation: '' },
    { name: 'Calcium bromide', answer: 'CaBr₂', explanation: '' },
    { name: 'Calcium iodide', answer: 'CaI₂', explanation: '' },
    { name: 'Calcium oxide', answer: 'CaO', explanation: '' },
    { name: 'Calcium sulfide', answer: 'CaS', explanation: '' },
    { name: 'Calcium nitride', answer: 'Ca₃N₂', explanation: '' },
    { name: 'Barium fluoride', answer: 'BaF₂', explanation: '' },
    { name: 'Barium chloride', answer: 'BaCl₂', explanation: '' },
    { name: 'Barium bromide', answer: 'BaBr₂', explanation: '' },
    { name: 'Barium iodide', answer: 'BaI₂', explanation: '' },
    { name: 'Barium oxide', answer: 'BaO', explanation: '' },
    { name: 'Barium sulfide', answer: 'BaS', explanation: '' },
    { name: 'Barium nitride', answer: 'Ba₃N₂', explanation: '' },
    // Aluminum (Group 13)
    { name: 'Aluminum fluoride', answer: 'AlF₃', explanation: '' },
    { name: 'Aluminum chloride', answer: 'AlCl₃', explanation: '' },
    { name: 'Aluminum bromide', answer: 'AlBr₃', explanation: '' },
    { name: 'Aluminum iodide', answer: 'AlI₃', explanation: '' },
    { name: 'Aluminum oxide', answer: 'Al₂O₃', explanation: '' },
    { name: 'Aluminum sulfide', answer: 'Al₂S₃', explanation: '' },
    { name: 'Aluminum nitride', answer: 'AlN', explanation: '' }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function IonicNameToFormulaActivity({ onBack, onPeriodicTable }) {
  const [problem, setProblem] = useState(getRandomIonicNameToFormulaProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const [showTable, setShowTable] = useState(false);

  function insertSubscript(sub) {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newValue = input.slice(0, start) + sub + input.slice(end);
    setInput(newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    }, 0);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim().replace(/\s/g,'').toLowerCase() === problem.answer.replace(/\s/g,'').toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Not quite. Try again.');
    }
  }

  function handleNext() {
    setProblem(getRandomIonicNameToFormulaProblem());
    setInput('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'Montserrat, Inter, Arial, sans-serif',
        fontWeight: 900,
        fontSize: '2.2em',
        letterSpacing: 2,
        background: 'linear-gradient(90deg,#b6f8e0 0,#c9b6f8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 32px #b6f8e088, 0 1.5px 0 #fff',
        marginBottom: 18
      }}>Ionic Name → Formula Activity</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.18em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #b6f8e055', marginBottom: 24 }}>
        <div style={{ textAlign: 'left', marginBottom: 18 }}>
          <span style={{
            fontFamily: 'Montserrat, Inter, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '1.13em',
            letterSpacing: 1.1,
            color: '#fff',
            background: 'linear-gradient(90deg,#b6f8e0 0,#c9b6f8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 18px #b6f8e0aa, 0 1px 0 #fff',
            marginRight: 8
          }}>Name:</span>
          <span style={{ color: '#b6f8e0', fontSize: '1.18em', fontWeight: 700 }}>{problem.name}</span>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
          <input
            className="glow-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the formula here"
            style={{ fontSize: '1.1em', width: '90%', maxWidth: 340, marginBottom: 10 }}
            ref={inputRef}
          />
          <div style={{ marginBottom: 8 }}>
            {['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'].map((sub, idx) => (
              <button
                key={sub}
                type="button"
                className="ptable-btn"
                style={{ minWidth: 32, padding: '2px 7px', margin: '0 2px', fontSize: '1.2em', lineHeight: 1, background: '#2d2d6a' }}
                onClick={() => insertSubscript(sub)}
                tabIndex={-1}
              >{sub}</button>
            ))}
          </div>
          <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }}>Submit</button>
        </form>
        {feedback && (
          <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>
            {feedback}
            {feedback.startsWith('❌') && (
              <div style={{ marginTop: 10, background: 'rgba(255,92,167,0.09)', borderRadius: 10, padding: '12px 16px', color: '#ff5ca7', fontWeight: 500, fontSize: '1.03em' }}>
                <b>Correct Answer:</b> <span style={{ color: '#b6f8e0', fontWeight: 700 }}>{problem.answer}</span><br/>
                <b>Explanation:</b> {problem.explanation || 'Check the charges for each ion and balance them to get a neutral compound.'}
                <div style={{ marginTop: 10, color: '#fff', background: 'rgba(182,248,224,0.10)', borderRadius: 8, padding: '10px 14px', fontSize: '0.98em' }}>
                  <b>How to get it right next time:</b>
                  <ol style={{ textAlign: 'left', margin: '8px 0 0 22px', padding: 0 }}>
                    <li>Find the symbol and charge for each ion (use the periodic table if needed).</li>
                    <li>Balance the total positive and negative charges so the compound is neutral.</li>
                    <li>Write the metal (cation) first, then the nonmetal (anion) second.</li>
                    <li>If more than one ion is needed, use subscripts to show the correct ratio.</li>
                    <li>Double-check your formula matches the charges and names given.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
        <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
        <button className="ptable-btn" style={{ marginTop: 18, background: '#4e46a1' }} onClick={onPeriodicTable}>Show Periodic Table</button>
        <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
      </div>
      {showTable && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.60)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#23234a', borderRadius:18, boxShadow:'0 6px 32px #b6f8e099', padding:30, maxWidth:900, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
            <PeriodicTable />
            <button className="ptable-btn" style={{position:'absolute', top:18, right:18, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={()=>setShowTable(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
