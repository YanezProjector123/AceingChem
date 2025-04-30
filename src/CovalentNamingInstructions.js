import React, { useState, useEffect } from 'react';

function getRandomCovalentProblem() {
  // Simple random generator for demo
  const problems = [
    {
      formula: 'CO2',
      answer: 'Carbon Dioxide',
      explanation: 'C = Carbon (no prefix), O2 = Dioxide (prefix di- for 2 oxygens).'
    },
    {
      formula: 'N2O5',
      answer: 'Dinitrogen Pentoxide',
      explanation: 'N2 = Dinitrogen (prefix di- for 2 nitrogens), O5 = Pentoxide (prefix penta- for 5 oxygens).'
    },
    {
      formula: 'NO',
      answer: 'Nitrogen Monoxide',
      explanation: 'N = Nitrogen (no prefix), O = Monoxide (prefix mono- for 1 oxygen).'
    },
    {
      formula: 'PCl3',
      answer: 'Phosphorus Trichloride',
      explanation: 'P = Phosphorus (no prefix), Cl3 = Trichloride (prefix tri- for 3 chlorines).'
    }
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function CovalentNamingInstructions({ onBack, onPeriodicTable, savedState, setSavedState }) {
  // Ensure step is always valid (0, 1, or 2)
  const initialStep = [0, 1, 2].includes(savedState?.step) ? savedState.step : 0;
  const [step, setStep] = useState(initialStep);
  const [input, setInput] = useState(savedState?.input ?? '');
  const [feedback, setFeedback] = useState(savedState?.feedback ?? '');
  const [problem, setProblem] = useState(savedState?.problem ?? getRandomCovalentProblem());


  // Interactive example problem flow
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
      setInput('');
      setFeedback('');
      
    } else {
      setProblem(getRandomCovalentProblem());
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
      <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.1em', textShadow: '0 2px 18px #e0b6f8aa, 0 1px 0 #fff', marginBottom: 18 }}>Covalent Naming Instructions Tutorial</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.18em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #e0b6f855', marginBottom: 24 }}>
        {step === 0 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>What is a Covalent (Molecular) Compound?</b><br />
              Covalent compounds are formed when two nonmetals share electrons. Examples: water (H<sub>2</sub>O), carbon dioxide (CO<sub>2</sub>).
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 1 && (
          <>
            <ol style={{ textAlign: 'left', paddingLeft: 28, marginBottom: 0 }}>
              <li><b>Use prefixes</b> (mono-, di-, tri-, tetra-, etc.) to indicate the number of each type of atom.</li>
              <li><b>First element:</b> Keep its name. <b>Never use "mono-" for the first element.</b></li>
              <li><b>Second element:</b> Change the ending to <b>-ide</b> and always use a prefix, even if it's "mono-".</li>
              <li><b>Drop the vowel</b> in the prefix if the element name begins with a vowel (e.g., monoxide, not monooxide).</li>
            </ol>
            <div style={{ marginTop: 22 }}>
              <b>Step-by-Step Examples</b>
              <div style={{ marginTop: 10, marginBottom: 10, padding: '16px', background: 'rgba(224,182,248,0.08)', borderRadius: 12 }}>
                <b>Example 1: CO<sub>2</sub></b><br />
                1. First element: C = Carbon (no prefix!)<br />
                2. Second element: O<sub>2</sub> = Oxygen → "oxide", prefix is "di-"<br />
                <span style={{ color: '#e0b6f8' }}>Answer: Carbon Dioxide</span>
              </div>
              <div style={{ marginBottom: 10, padding: '16px', background: 'rgba(224,182,248,0.08)', borderRadius: 12 }}>
                <b>Example 2: NO</b><br />
                1. First element: N = Nitrogen (no prefix!)<br />
                2. Second element: O = Oxygen → "oxide", prefix is "mono-"<br />
                <span style={{ color: '#e0b6f8' }}>Answer: Nitrogen Monoxide</span>
                <button className="ptable-btn" style={{ margin: '6px 0', background: '#23234a' }}
                  onClick={() => onPeriodicTable && onPeriodicTable({ step, input, feedback, problem, showExplanation })}
                >Show Periodic Table</button>
              </div>
              <div style={{ marginBottom: 10, padding: '16px', background: 'rgba(224,182,248,0.08)', borderRadius: 12 }}>
                <b>Example 3: P<sub>2</sub>O<sub>5</sub></b><br />
                1. First element: P<sub>2</sub> = Phosphorus, prefix is "di-"<br />
                2. Second element: O<sub>5</sub> = Oxygen → "oxide", prefix is "penta-"<br />
                <span style={{ color: '#e0b6f8' }}>Answer: Diphosphorus Pentoxide</span>
              </div>
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>Practice: What is the name of this compound?</b><br />
              <span style={{ color: '#e0b6f8', fontSize: '1.2em' }}>{problem.formula}</span>
            </div>
            <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
              <input
                className="glow-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type the name here"
                style={{ fontSize: '1.1em', width: '90%', maxWidth: 340, marginBottom: 10 }}
              />
              <br />
              <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }}>Submit</button>
            </form>
            <button className="ptable-btn" style={{ margin: '6px 0', background: '#23234a' }}
              onClick={() => onPeriodicTable && onPeriodicTable({ step, input, feedback, problem })}
            >Show Periodic Table</button>
            {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
            <div style={{ marginTop: 10, background: 'rgba(224,182,248,0.13)', borderRadius: 10, padding: '12px 16px', color: '#e0b6f8' }}>{problem.explanation}</div>
            <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
            <button className="ptable-btn" style={{ marginTop: 18, background: '#4e46a1' }} onClick={() => setStep(0)}>Review Tutorial</button>
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
