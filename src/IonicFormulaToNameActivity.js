import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';
import PolyatomicIonReference from './PolyatomicIonReference';

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
    { formula: 'AlN', answer: 'Aluminum nitride', explanation: '' },
    // Polyatomic ions
    { formula: 'Na₂SO₄', answer: 'Sodium sulfate', explanation: 'Sodium is Na⁺, sulfate is SO₄²⁻. Need 2 Na⁺ for each SO₄²⁻.' },
    { formula: 'KNO₃', answer: 'Potassium nitrate', explanation: 'Potassium is K⁺, nitrate is NO₃⁻.' },
    { formula: 'CaCO₃', answer: 'Calcium carbonate', explanation: 'Calcium is Ca²⁺, carbonate is CO₃²⁻.' },
    { formula: 'NH₄Cl', answer: 'Ammonium chloride', explanation: 'Ammonium is NH₄⁺, chloride is Cl⁻.' },
    { formula: 'Mg₃(PO₄)₂', answer: 'Magnesium phosphate', explanation: 'Magnesium is Mg²⁺, phosphate is PO₄³⁻. Need 3 Mg²⁺ for 2 PO₄³⁻.' },
    { formula: 'Al(OH)₃', answer: 'Aluminum hydroxide', explanation: 'Aluminum is Al³⁺, hydroxide is OH⁻. Need 3 OH⁻ for each Al³⁺.' },
    { formula: 'Ca(C₂H₃O₂)₂', answer: 'Calcium acetate', explanation: 'Calcium is Ca²⁺, acetate is C₂H₃O₂⁻. Need 2 acetates for each Ca²⁺.' },
    { formula: 'KMnO₄', answer: 'Potassium permanganate', explanation: 'Potassium is K⁺, permanganate is MnO₄⁻.' },
    { formula: 'NaHCO₃', answer: 'Sodium bicarbonate', explanation: 'Sodium is Na⁺, bicarbonate is HCO₃⁻.' },
    { formula: '(NH₄)₂SO₄', answer: 'Ammonium sulfate', explanation: 'Ammonium is NH₄⁺, sulfate is SO₄²⁻. Need 2 NH₄⁺ for each SO₄²⁻.' },
    { formula: 'Fe(NO₃)₃', answer: 'Iron(III) nitrate', explanation: 'Iron(III) is Fe³⁺, nitrate is NO₃⁻. Need 3 nitrates for each Fe³⁺.' },
    { formula: 'CuSO₄', answer: 'Copper(II) sulfate', explanation: 'Copper(II) is Cu²⁺, sulfate is SO₄²⁻.' },
    { formula: 'BaCrO₄', answer: 'Barium chromate', explanation: 'Barium is Ba²⁺, chromate is CrO₄²⁻.' },
    { formula: 'Pb(C₂H₃O₂)₂', answer: 'Lead(II) acetate', explanation: 'Lead(II) is Pb²⁺, acetate is C₂H₃O₂⁻.' },
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
  const [showPolyatomic, setShowPolyatomic] = useState(false);
  
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
      let msg = '❌ Not quite. Try again.';
      if (problem.explanation) {
        msg += ' Explanation: ' + problem.explanation + ' (Tip: Use the Polyatomic Ion Reference if needed!)';
      }
      setFeedback(msg);
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
      <div className="center-container fade-in slide-up">
        <div className="glass-card">
          <h2 className="ptable-title">Ionic Formula → Name Activity</h2>
          <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.formula}</span></div>
          <form onSubmit={handleSubmit}>
            <input
              className="glow-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type the name here"
              ref={inputRef}
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
            <div style={{
              position: 'relative',
              width: '94vw',
              maxWidth: 420,
              margin: '0 auto 16px auto',
              boxSizing: 'border-box',
            }}>
              <div style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                background: '#fff',
                borderRadius: 10,
                border: '1.5px solid #b6f8e0',
                padding: '6px 0 6px 6px',
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                minHeight: 54,
                alignItems: 'center',
                boxShadow: '0 2px 8px #b6f8e022',
                width: '100%',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                scrollbarColor: '#b6f8e0 #fff',
                scrollbarWidth: 'thin',
              }}>
                {['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'].map((sub, idx) => (
                  <button
                    key={sub}
                    type="button"
                    className="ptable-btn"
                    onClick={() => insertSubscript(sub)}
                    tabIndex={-1}
                    style={{ minWidth: 44, minHeight: 38, fontSize: '1.5em', color: '#23234a', background: '#e0f7fa', border: '1.5px solid #b6f8e0', borderRadius: 8, margin: 0, padding: 0, flex: '0 0 auto', fontWeight: 700 }}
                  >{sub}</button>
                ))}
                {/* Right arrow icon as scroll cue */}
                <span style={{ display: 'inline-block', minWidth: 24, height: 38, verticalAlign: 'middle', marginLeft: 6, color: '#b6f8e0', fontSize: '1.5em', userSelect: 'none', pointerEvents: 'none' }}>→</span>
              </div>
              {/* Fade gradient overlay for scroll cue */}
              <div style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 36,
                height: '100%',
                background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, #fff 80%)',
                borderRadius: '0 10px 10px 0',
                zIndex: 2,
              }} />
            </div>
            <button className="ptable-btn" type="submit" style={{ width: '100%', marginBottom: 6 }}>Submit</button>
          </form>
          {feedback && (
            <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'} style={{ marginTop: 8, fontSize: '1.08em' }}>
              {feedback}
            </div>
          )}
          <button className="ptable-btn" onClick={handleNext} disabled={showTable || showPolyatomic} style={{ width: '100%', marginTop: 8 }}>Try Another</button>
          <button className="ptable-btn" onClick={() => setShowPolyatomic(true)} style={{ width: '100%', marginTop: 8 }}>Show Polyatomic Ion Reference</button>
          {!showTable && !showPolyatomic && (
            <button className="ptable-btn" onClick={() => setShowTable(true)} style={{ width: '100%', marginTop: 8 }}>Show Periodic Table</button>
          )}
          {!showTable && !showPolyatomic && (
            <button className="back-btn" onClick={onBack} style={{ width: '100%', marginTop: 8 }}>Back</button>
          )}
        </div>
      </div>
      {showTable && (
        <div className="ptable-modal">
          <div className="glass-card" style={{ maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto' }}>
            <PeriodicTable onBack={() => setShowTable(false)} />
          </div>
        </div>
      )}
      {showPolyatomic && (
        <div className="ptable-modal">
          <PolyatomicIonReference onClose={() => setShowPolyatomic(false)} />
        </div>
      )}
    </>
  );
}
