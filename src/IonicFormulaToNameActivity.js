import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';

// Demo problems for Ionic Formula to Name
function getRandomIonicFormulaToNameProblem() {
  const problems = [
    // Alkali metals (Group 1)
    { formula: 'LiF', answer: 'Lithium fluoride', explanation: '' },
    { formula: 'RbF', answer: 'Rubidium fluoride', explanation: '' },
    { formula: 'RbCl', answer: 'Rubidium chloride', explanation: '' },
    { formula: 'RbBr', answer: 'Rubidium bromide', explanation: '' },
    { formula: 'RbI', answer: 'Rubidium iodide', explanation: '' },
    { formula: 'Rb₂O', answer: 'Rubidium oxide', explanation: '' },
    { formula: 'Rb₂S', answer: 'Rubidium sulfide', explanation: '' },
    { formula: 'Rb₃N', answer: 'Rubidium nitride', explanation: '' },
    { formula: 'CsF', answer: 'Cesium fluoride', explanation: '' },
    { formula: 'CsCl', answer: 'Cesium chloride', explanation: '' },
    { formula: 'CsBr', answer: 'Cesium bromide', explanation: '' },
    { formula: 'CsI', answer: 'Cesium iodide', explanation: '' },
    { formula: 'Cs₂O', answer: 'Cesium oxide', explanation: '' },
    { formula: 'Cs₂S', answer: 'Cesium sulfide', explanation: '' },
    { formula: 'Cs₃N', answer: 'Cesium nitride', explanation: '' },
    { formula: 'FrF', answer: 'Francium fluoride', explanation: '' },
    { formula: 'FrCl', answer: 'Francium chloride', explanation: '' },
    { formula: 'FrBr', answer: 'Francium bromide', explanation: '' },
    { formula: 'FrI', answer: 'Francium iodide', explanation: '' },
    { formula: 'Fr₂O', answer: 'Francium oxide', explanation: '' },
    { formula: 'Fr₂S', answer: 'Francium sulfide', explanation: '' },
    { formula: 'Fr₃N', answer: 'Francium nitride', explanation: '' },
    { formula: 'LiCl', answer: 'Lithium chloride', explanation: '' },
    { formula: 'LiBr', answer: 'Lithium bromide', explanation: '' },
    { formula: 'LiI', answer: 'Lithium iodide', explanation: '' },
    { formula: 'Li₂O', answer: 'Lithium oxide', explanation: '' },
    { formula: 'Li₂S', answer: 'Lithium sulfide', explanation: '' },
    { formula: 'Li₃N', answer: 'Lithium nitride', explanation: '' },
    { formula: 'NaF', answer: 'Sodium fluoride', explanation: '' },
    { formula: 'NaCl', answer: 'Sodium chloride', explanation: '' },
    { formula: 'NaBr', answer: 'Sodium bromide', explanation: '' },
    { formula: 'NaI', answer: 'Sodium iodide', explanation: '' },
    { formula: 'Na₂O', answer: 'Sodium oxide', explanation: '' },
    { formula: 'Na₂S', answer: 'Sodium sulfide', explanation: '' },
    { formula: 'Na₃N', answer: 'Sodium nitride', explanation: '' },
    { formula: 'KF', answer: 'Potassium fluoride', explanation: '' },
    { formula: 'KCl', answer: 'Potassium chloride', explanation: '' },
    { formula: 'KBr', answer: 'Potassium bromide', explanation: '' },
    { formula: 'KI', answer: 'Potassium iodide', explanation: '' },
    { formula: 'K₂O', answer: 'Potassium oxide', explanation: '' },
    { formula: 'K₂S', answer: 'Potassium sulfide', explanation: '' },
    { formula: 'K₃N', answer: 'Potassium nitride', explanation: '' },
    // Alkaline earth metals (Group 2)
    { formula: 'RaF₂', answer: 'Radium fluoride', explanation: '' },
    { formula: 'RaCl₂', answer: 'Radium chloride', explanation: '' },
    { formula: 'RaBr₂', answer: 'Radium bromide', explanation: '' },
    { formula: 'RaI₂', answer: 'Radium iodide', explanation: '' },
    { formula: 'RaO', answer: 'Radium oxide', explanation: '' },
    { formula: 'RaS', answer: 'Radium sulfide', explanation: '' },
    { formula: 'Ra₃N₂', answer: 'Radium nitride', explanation: '' },
    { formula: 'MgF₂', answer: 'Magnesium fluoride', explanation: '' },
    { formula: 'MgCl₂', answer: 'Magnesium chloride', explanation: '' },
    { formula: 'MgBr₂', answer: 'Magnesium bromide', explanation: '' },
    { formula: 'MgI₂', answer: 'Magnesium iodide', explanation: '' },
    { formula: 'MgO', answer: 'Magnesium oxide', explanation: '' },
    { formula: 'MgS', answer: 'Magnesium sulfide', explanation: '' },
    { formula: 'Mg₃N₂', answer: 'Magnesium nitride', explanation: '' },
    { formula: 'CaF₂', answer: 'Calcium fluoride', explanation: '' },
    { formula: 'CaCl₂', answer: 'Calcium chloride', explanation: '' },
    { formula: 'CaBr₂', answer: 'Calcium bromide', explanation: '' },
    { formula: 'CaI₂', answer: 'Calcium iodide', explanation: '' },
    { formula: 'CaO', answer: 'Calcium oxide', explanation: '' },
    { formula: 'CaS', answer: 'Calcium sulfide', explanation: '' },
    { formula: 'Ca₃N₂', answer: 'Calcium nitride', explanation: '' },
    { formula: 'BaF₂', answer: 'Barium fluoride', explanation: '' },
    { formula: 'BaCl₂', answer: 'Barium chloride', explanation: '' },
    { formula: 'BaBr₂', answer: 'Barium bromide', explanation: '' },
    { formula: 'BaI₂', answer: 'Barium iodide', explanation: '' },
    { formula: 'BaO', answer: 'Barium oxide', explanation: '' },
    { formula: 'BaS', answer: 'Barium sulfide', explanation: '' },
    { formula: 'Ba₃N₂', answer: 'Barium nitride', explanation: '' },
    // Aluminum (Group 13)
    { formula: 'AlF₃', answer: 'Aluminum fluoride', explanation: '' },
    { formula: 'AlCl₃', answer: 'Aluminum chloride', explanation: '' },
    { formula: 'AlBr₃', answer: 'Aluminum bromide', explanation: '' },
    { formula: 'AlI₃', answer: 'Aluminum iodide', explanation: '' },
    { formula: 'Al₂O₃', answer: 'Aluminum oxide', explanation: '' },
    { formula: 'Al₂S₃', answer: 'Aluminum sulfide', explanation: '' },
    { formula: 'AlN', answer: 'Aluminum nitride', explanation: '' }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function IonicFormulaToNameActivity({ onBack, onPeriodicTable }) {
  // Create a ref to store the initial problem
  const [problem, setProblem] = useState(getRandomIonicFormulaToNameProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const [showTable, setShowTable] = useState(false);
  
  // Remove local table state since it will be managed by the parent component
  // const [showTable, setShowTable] = useState(false);

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
    if (input.trim().toLowerCase() === problem.answer.toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Not quite. Try again.');
    }
  }

  function handleNext() {
    // Create a new problem
    setProblem(getRandomIonicFormulaToNameProblem());
    setInput('');
    setFeedback('');
  }

  return (
    <>
      <div className="center-container fade-in slide-up if2n-activity-root" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', filter: showTable ? 'blur(3px)' : 'none', transition: 'filter 0.3s ease-out' }}>
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
        }}>Ionic Formula → Name Activity</h2>
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
            }}>Formula:</span>
            <span style={{ color: '#b6f8e0', fontSize: '1.18em', fontWeight: 700 }}>{problem.formula}</span>
          </div>
          <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
            <input
              className="glow-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type the name here"
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
                  <b>Explanation:</b> {problem.explanation || 'Check the ions in the formula and match them to the correct name.'}
                  <div style={{ marginTop: 10, color: '#fff', background: 'rgba(182,248,224,0.10)', borderRadius: 8, padding: '10px 14px', fontSize: '0.98em' }}>
                    <b>How to get it right next time:</b>
                    <ol style={{ textAlign: 'left', margin: '8px 0 0 22px', padding: 0 }}>
                      <li>Identify the cation (metal) and anion (nonmetal) in the formula.</li>
                      <li>Use the periodic table to find their names and charges.</li>
                      <li>Name the cation first, then the anion (change ending to -ide).</li>
                      <li>Check subscripts to determine how many of each ion are present.</li>
                      <li>Make sure your answer matches the formula's ratio and naming rules.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext} disabled={showTable}>Try Another</button>
          {!showTable && (
            <button className="ptable-btn" style={{ marginTop: 18, background: '#4e46a1' }} onClick={() => setShowTable(true)}>Show Periodic Table</button>
          )}
          {!showTable && (
            <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
          )}
        </div>
      </div>
      {/* Periodic Table Modal Overlay */}
      {showTable && (
        <div className="if2n-modal" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
            <div style={{
                background: '#1e293b',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                maxWidth: '95%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <PeriodicTable onBack={() => setShowTable(false)} />
                <button className="ptable-btn" style={{position:'absolute', top:18, right:18, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={()=>setShowTable(false)}>Close</button>
            </div>
        </div>
      )}
    </>
  );
}
