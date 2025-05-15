import React, { useState, useEffect } from 'react';

function getRandomIonicFormulaProblem() {
  // Simple random generator for demo
  const problems = [
    {
      name: 'Calcium chloride',
      answer: 'CaCl2',
      explanation: 'Ca is 2+, Cl is 1-. Need 2 Cl- for each Ca2+ (CaCl2).'
    },
    {
      name: 'Potassium oxide',
      answer: 'K2O',
      explanation: 'K is 1+, O is 2-. Need 2 K+ for each O2- (K2O).'
    },
    {
      name: 'Aluminum nitrate',
      answer: 'Al(NO3)3',
      explanation: 'Al is 3+, NO3 is 1-. Need 3 NO3- for each Al3+ (Al(NO3)3).'
    },
    {
      name: 'Magnesium phosphate',
      answer: 'Mg3(PO4)2',
      explanation: 'Mg is 2+, PO4 is 3-. Need 3 Mg2+ and 2 PO4 3- (Mg3(PO4)2).'
    }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function IonicFormulaInstructions({ onBack, onPeriodicTable, savedState, setSavedState }) {
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
  const [problem, setProblem] = useState(savedState?.problem ?? getRandomIonicFormulaProblem());

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
      setProblem(getRandomIonicFormulaProblem());
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
      <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.1em', textShadow: '0 2px 18px #b6f8e0aa, 0 1px 0 #fff', marginBottom: 18 }}>How to Write Ionic Compound Formulas</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.18em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #b6f8e055', marginBottom: 24 }}>
        {step === 0 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>What does it mean to "write the formula"?</b><br />
              This means writing the chemical symbols and subscripts to represent the ratio of ions in a compound. Example: Sodium chloride = NaCl.
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 1 && (
          <>
            <ol style={{ textAlign: 'left', paddingLeft: 28, marginBottom: 0 }}>
              <li><b>Write the symbols</b> for the cation and anion.</li>
              <li><b>Determine the charges</b> on each ion.</li>
              <li><b>Balance the charges</b> so the total positive and negative charges are equal (the compound is neutral).</li>
              <li><b>Write subscripts</b> to show how many of each ion are needed to balance the charges.</li>
              <li>If more than one polyatomic ion is needed, put it in parentheses with the subscript outside.</li>
            </ol>
            <div style={{ marginTop: 22 }}>
              <b>Step-by-Step Examples</b>
              <div style={{ marginTop: 10, marginBottom: 10, padding: '16px', background: 'rgba(182,248,224,0.08)', borderRadius: 12 }}>
                <b>Example 1: Magnesium chloride</b><br />
                1. Mg<sup>2+</sup> and Cl<sup>-</sup><br />
                2. Need 2 Cl<sup>-</sup> to balance 1 Mg<sup>2+</sup><br />
                <span style={{ color: '#b6f8e0' }}>Answer: MgCl<sub>2</sub></span>
              </div>
              <div style={{ marginBottom: 10, padding: '16px', background: 'rgba(182,248,224,0.08)', borderRadius: 12 }}>
                <b>Example 2: Aluminum sulfate</b><br />
                1. Al<sup>3+</sup> and SO<sub>4</sub><sup>2-</sup><br />
                2. Balance: 2 Al<sup>3+</sup> (total +6), 3 SO<sub>4</sub><sup>2-</sup> (total -6)<br />
                <span style={{ color: '#b6f8e0' }}>Answer: Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub></span>
              </div>
              <div style={{ marginBottom: 10, padding: '16px', background: 'rgba(182,248,224,0.08)', borderRadius: 12 }}>
                <b>Example 3: Iron(III) oxide</b><br />
                1. Fe<sup>3+</sup> and O<sup>2-</sup><br />
                2. Balance: 2 Fe<sup>3+</sup> (total +6), 3 O<sup>2-</sup> (total -6)
                <br /><span style={{ color: '#b6f8e0' }}>Answer: Fe<sub>2</sub>O<sub>3</sub></span>
              </div>
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>Practice: Write the formula for this compound:</b><br />
              <span style={{ color: '#b6f8e0', fontSize: '1.2em' }}>{problem.name}</span>
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
            {/* Only show explanation if correct */}
            {feedback.startsWith('✅') && (
              <div style={{ marginTop: 10, background: 'rgba(182,248,224,0.13)', borderRadius: 10, padding: '12px 16px', color: '#b6f8e0' }}>{problem.explanation}</div>
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
