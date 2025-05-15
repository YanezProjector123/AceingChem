import React, { useState, useEffect } from 'react';

function getRandomCovalentFormulaProblem() {
  const problems = [
    {
      name: 'Dinitrogen monoxide',
      answer: 'N2O',
      explanation: 'Di- means 2 nitrogen (N2), mono- means 1 oxygen (O).'
    },
    {
      name: 'Carbon tetrachloride',
      answer: 'CCl4',
      explanation: 'Mono- (implied) is 1 carbon (C), tetra- is 4 chlorine (Cl4).'
    },
    {
      name: 'Sulfur hexafluoride',
      answer: 'SF6',
      explanation: 'Mono- (implied) is 1 sulfur (S), hexa- is 6 fluorine (F6).'
    },
    {
      name: 'Phosphorus trichloride',
      answer: 'PCl3',
      explanation: 'Mono- (implied) is 1 phosphorus (P), tri- is 3 chlorine (Cl3).'
    }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function CovalentFormulaInstructions({ onBack, onPeriodicTable, savedState, setSavedState }) {
  const inputRef = React.useRef(null);

  // Helper to insert subscript at cursor
  function insertSubscript(sub) {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newValue = input.slice(0, start) + sub + input.slice(end);
    setInput(newValue);
    // Restore focus and cursor after update
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    }, 0);
  }
  // Ensure step is always valid (0, 1, or 2)
  const initialStep = [0, 1, 2].includes(savedState?.step) ? savedState.step : 0;
  const [step, setStep] = useState(initialStep);
  const [input, setInput] = useState(savedState?.input ?? '');
  const [feedback, setFeedback] = useState(savedState?.feedback ?? '');
  const [problem, setProblem] = useState(savedState?.problem ?? getRandomCovalentFormulaProblem());

  useEffect(() => {
    setSavedState && setSavedState({ step, input, feedback, problem });
    // eslint-disable-next-line
  }, [step, input, feedback, problem]);

  // Interactive example problem flow
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
      setInput('');
      setFeedback('');
    } else {
      setProblem(getRandomCovalentFormulaProblem());
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
      <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.1em', textShadow: '0 2px 18px #e0b6f8aa, 0 1px 0 #fff', marginBottom: 18 }}>How to Write Covalent Compound Formulas</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.18em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #e0b6f855', marginBottom: 24 }}>
        {step === 0 && (
          <>
            <div style={{textAlign:'left', marginBottom:18}}>
              <b>What does it mean to "write the formula"?</b><br/>
              This means using element symbols and subscripts to show how many atoms of each element are in a molecule. Example: carbon dioxide = CO<sub>2</sub>.
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 1 && (
          <>
            <ol style={{ textAlign: 'left', paddingLeft: 28, marginBottom: 0 }}>
              <li><b>Write the symbols</b> for each element in the order they appear in the name.</li>
              <li><b>Use the prefixes</b> in the name to determine the number of each atom (mono-, di-, tri-, etc.).</li>
              <li><b>Write subscripts</b> after each element symbol to show the number of atoms (omit "1").</li>
            </ol>
            <div style={{marginTop:22}}>
              <b>Step-by-Step Examples</b>
              <div style={{marginTop:10, marginBottom:10, padding:'16px', background:'rgba(224,182,248,0.08)', borderRadius:12}}>
                <b>Example 1: Dinitrogen monoxide</b><br/>
                1. "Di-" = 2 N, "mon-" = 1 O<br/>
                <span style={{color:'#e0b6f8'}}>Answer: N<sub>2</sub>O</span>
              </div>
              <div style={{marginBottom:10, padding:'16px', background:'rgba(224,182,248,0.08)', borderRadius:12}}>
                <b>Example 2: Carbon tetrachloride</b><br/>
                1. "Mono-" (implied) = 1 C, "tetra-" = 4 Cl<br/>
                <span style={{color:'#e0b6f8'}}>Answer: CCl<sub>4</sub></span>
              </div>
              <div style={{marginBottom:10, padding:'16px', background:'rgba(224,182,248,0.08)', borderRadius:12}}>
                <b>Example 3: Sulfur hexafluoride</b><br/>
                1. "Mono-" (implied) = 1 S, "hexa-" = 6 F<br/>
                <span style={{color:'#e0b6f8'}}>Answer: SF<sub>6</sub></span>
              </div>
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>Practice: Write the formula for this compound:</b><br />
              <span style={{ color: '#e0b6f8', fontSize: '1.2em' }}>{problem.name}</span>
            </div>
            <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
              <input
                className="glow-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type the formula here"
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
                ref={inputRef}
              />
              <div style={{
                position: 'relative',
                width: '94vw',
                maxWidth: 420,
                margin: '0 auto 16px auto',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  flexWrap: 'wrap',
                  background: '#fff',
                  borderRadius: 10,
                  border: '1.5px solid #b6f8e0',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 54,
                  alignItems: 'center',
                  boxShadow: '0 2px 8px #b6f8e022',
                  width: '100%',
                  boxSizing: 'border-box',
                }}>
                  {['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'].map((sub, idx) => (
                    <button
                      key={sub}
                      type="button"
                      className="ptable-btn"
                      style={{ minWidth: 44, minHeight: 38, fontSize: '1.5em', color: '#23234a', background: '#e0f7fa', border: '1.5px solid #b6f8e0', borderRadius: 8, margin: 0, padding: 0, fontWeight: 700 }}
                      onClick={() => insertSubscript(sub)}
                      tabIndex={-1}
                    >{sub}</button>
                  ))}
                </div>
              </div>
              <div className="button-row">
                <button className="ptable-btn" type="submit">Submit</button>
              </div>
            </form>
            <div className="button-row">
              <button className="ptable-btn" onClick={() => onPeriodicTable && onPeriodicTable({ step, input, feedback, problem })}>Show Periodic Table</button>
              <button className="ptable-btn" onClick={handleNext}>Try Another</button>
              <button className="ptable-btn" style={{ background: '#4e46a1' }} onClick={() => setStep(0)}>Review Tutorial</button>
            </div>
            {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
            {feedback.startsWith('✅') && (
              <div style={{ marginTop: 10, background: 'rgba(224,182,248,0.13)', borderRadius: 10, padding: '12px 16px', color: '#e0b6f8' }}>{problem.explanation}</div>
            )}
          </>
        )}
        {/* Fallback for out-of-range step values */}
        {step !== 0 && step !== 1 && step !== 2 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#ff5ca7' }}>
            <b>Oops! Something went wrong.</b>
            <div style={{ marginTop: 12 }}>Please go back and restart the tutorial.</div>
          </div>
        )}
      </div>

      <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
    </div>
  );
}

