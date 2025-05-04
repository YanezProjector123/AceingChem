import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';

function getRandomIonicProblem() {
  // Very simple random generator for demo purposes
  const problems = [
    { formula: 'NaCl', answer: 'Sodium Chloride', explanation: 'Na is sodium (cation), Cl is chloride (anion). Name the cation, then the anion with -ide.' },
    { formula: 'MgO', answer: 'Magnesium Oxide', explanation: 'Mg is magnesium (cation), O is oxide (anion). Name the cation, then the anion with -ide.' },
    { formula: 'KNO3', answer: 'Potassium Nitrate', explanation: 'K is potassium (cation), NO₃ is nitrate (polyatomic anion). Use the name of the polyatomic ion as is.' },
    { formula: 'FeCl2', answer: 'Iron(II) Chloride', explanation: 'Fe is iron, a transition metal. Cl is chloride. The (II) shows iron is +2 here.' },
    { formula: 'CaSO4', answer: 'Calcium Sulfate', explanation: 'Ca is calcium (cation), SO₄ is sulfate (polyatomic anion).' }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function IonicNamingInstructions({ onBack, onPeriodicTable, savedState, setSavedState }) {
  // Ensure step is always valid (0, 1, or 2)
  const initialStep = [0, 1, 2].includes(savedState?.step) ? savedState.step : 0;
  const [step, setStep] = useState(initialStep);
  const [input, setInput] = useState(savedState?.input ?? '');
  const [feedback, setFeedback] = useState(savedState?.feedback ?? '');
  const [problem, setProblem] = useState(savedState?.problem ?? getRandomIonicProblem());


  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
      setInput('');
      setFeedback('');
      
    } else {
      // Stay at step 2 and load a new problem
      setProblem(getRandomIonicProblem());
      setInput('');
      setFeedback('');
      
      setStep(2);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === problem.answer.toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Not quite. Try again.');
    }
  };

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.1em', textShadow: '0 2px 18px #b6f8e0aa, 0 1px 0 #fff', marginBottom: 18 }}>Ionic Naming Conventions Tutorial</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.18em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #b6f8e055', marginBottom: 24 }}>
        {step === 0 && (
          <>
            <div style={{textAlign:'left', marginBottom:18}}>
              <b>What is an Ionic Compound?</b><br/>
              Ionic compounds are made of positive ions (cations) and negative ions (anions) held together by electrostatic attraction. Examples: table salt (NaCl), calcium chloride (CaCl<sub>2</sub>).
            </div>
            <button className="ptable-btn" style={{marginTop:18}} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 1 && (
          <>
            <div style={{textAlign:'left', marginBottom:18}}>
              <b>How to Name Ionic Compounds:</b>
              <ol style={{ textAlign: 'left', paddingLeft: 28, marginBottom: 0 }}>
                <li>Write the <b>cation</b> (positive ion) name first.</li>
                <li>Write the <b>anion</b> (negative ion) name second.</li>
                <li>For simple ions, change the ending of the anion to <b>-ide</b>.</li>
                <li>For polyatomic ions, use the ion name as is.</li>
                <li>Do <b>not</b> use prefixes (mono-, di-, etc.).</li>
                <li>For transition metals, use Roman numerals to show the charge.</li>
              </ol>
            </div>
            <button className="ptable-btn" style={{marginTop:18}} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{textAlign:'left', marginBottom:18}}>
              <b>Example:</b> <span style={{color:'#b6f8e0'}}>{problem.formula}</span><br/>
              <span style={{fontSize:'1.05em'}}>What is the name of this compound?</span>
            </div>
            <form onSubmit={handleSubmit} style={{marginBottom:10}}>
              <input
                className="glow-input"
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Type the name here"
                style={{
                  width: '94vw',
                  maxWidth: 420,
                  fontSize: '1.15em',
                  background: '#fff',
                  color: '#23234a',
                  border: '2px solid #b6f8e0',
                  borderRadius: 10,
                  padding: '12px 14px',
                  margin: '0 auto 4px auto',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                  outline: 'none',
                  boxShadow: '0 1px 8px #b6f8e022',
                  display: 'block',
                }}
              />
              <div className="button-row">
                <button className="ptable-btn" type="submit">Submit</button>
              </div>
            </form>
            <div className="button-row">
              <button className="ptable-btn" onClick={() => onPeriodicTable && onPeriodicTable({step, input, feedback, problem})}>Show Periodic Table</button>
              <button className="ptable-btn" onClick={handleNext}>Try Another</button>
              <button className="ptable-btn" style={{background:'#4e46a1'}} onClick={() => setStep(0)}>Review Tutorial</button>
            </div>
            {feedback && <div style={{margin:'10px 0', fontWeight:600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7'}}>{feedback}</div>}
            {feedback.startsWith('✅') && (
              <div style={{marginTop:10, background:'rgba(182,248,224,0.13)', borderRadius:10, padding:'12px 16px', color:'#b6f8e0'}}>{problem.explanation}</div>
            )}
          </>
        )}
        {/* Fallback for out-of-range step values */}
        {step !== 0 && step !== 1 && step !== 2 && (
          <div style={{padding:'24px', textAlign:'center', color:'#ff5ca7'}}>
            <b>Oops! Something went wrong.</b>
            <div style={{marginTop:12}}>Please go back and restart the tutorial.</div>
          </div>
        )}
      </div>
      <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
    </div>
  );
}
