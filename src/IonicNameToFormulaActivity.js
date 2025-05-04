import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';
import PolyatomicIonReference from './PolyatomicIonReference';

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
    { name: 'Aluminum nitride', answer: 'AlN', explanation: '' },
    // Polyatomic ions
    { name: 'Sodium sulfate', answer: 'Na₂SO₄', explanation: 'Sodium is Na⁺, sulfate is SO₄²⁻. Need 2 Na⁺ for each SO₄²⁻.' },
    { name: 'Potassium nitrate', answer: 'KNO₃', explanation: 'Potassium is K⁺, nitrate is NO₃⁻.' },
    { name: 'Calcium carbonate', answer: 'CaCO₃', explanation: 'Calcium is Ca²⁺, carbonate is CO₃²⁻.' },
    { name: 'Ammonium chloride', answer: 'NH₄Cl', explanation: 'Ammonium is NH₄⁺, chloride is Cl⁻.' },
    { name: 'Magnesium phosphate', answer: 'Mg₃(PO₄)₂', explanation: 'Magnesium is Mg²⁺, phosphate is PO₄³⁻. Need 3 Mg²⁺ for 2 PO₄³⁻.' },
    { name: 'Aluminum hydroxide', answer: 'Al(OH)₃', explanation: 'Aluminum is Al³⁺, hydroxide is OH⁻. Need 3 OH⁻ for each Al³⁺.' },
    { name: 'Calcium acetate', answer: 'Ca(C₂H₃O₂)₂', explanation: 'Calcium is Ca²⁺, acetate is C₂H₃O₂⁻. Need 2 acetates for each Ca²⁺.' },
    { name: 'Potassium permanganate', answer: 'KMnO₄', explanation: 'Potassium is K⁺, permanganate is MnO₄⁻.' },
    { name: 'Sodium bicarbonate', answer: 'NaHCO₃', explanation: 'Sodium is Na⁺, bicarbonate is HCO₃⁻.' },
    { name: 'Ammonium sulfate', answer: '(NH₄)₂SO₄', explanation: 'Ammonium is NH₄⁺, sulfate is SO₄²⁻. Need 2 NH₄⁺ for each SO₄²⁻.' },
    { name: 'Iron(III) nitrate', answer: 'Fe(NO₃)₃', explanation: 'Iron(III) is Fe³⁺, nitrate is NO₃⁻. Need 3 nitrates for each Fe³⁺.' },
    { name: 'Copper(II) sulfate', answer: 'CuSO₄', explanation: 'Copper(II) is Cu²⁺, sulfate is SO₄²⁻.' },
    { name: 'Barium chromate', answer: 'BaCrO₄', explanation: 'Barium is Ba²⁺, chromate is CrO₄²⁻.' },
    { name: 'Lead(II) acetate', answer: 'Pb(C₂H₃O₂)₂', explanation: 'Lead(II) is Pb²⁺, acetate is C₂H₃O₂⁻.' },
  ];
  return problems[Math.floor(Math.random()*problems.length)];
}

export default function IonicNameToFormulaActivity({ onBack, onPeriodicTable }) {
  const [problem, setProblem] = useState(getRandomIonicNameToFormulaProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const [showTable, setShowTable] = useState(false);
  const [showPolyatomic, setShowPolyatomic] = useState(false);

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
      let msg = '❌ Not quite.';
      if (problem.explanation) {
        msg += ' Explanation: ' + problem.explanation;
      }
      msg += '\n\uD83D\uDCA1 Tip: For ionic compounds, write the cation (metal) first, then the anion (nonmetal or polyatomic ion). Balance the charges so the total is neutral. Use the Polyatomic Ion Reference if needed!';
      setFeedback(msg);
    }
  }

  function handleNext() {
    setProblem(getRandomIonicNameToFormulaProblem());
    setInput('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up" style={{ position: 'relative', overflow: 'hidden' }}>
      <span className="floating-chem-icon" style={{ left: '8vw', top: '12vh', fontSize: '2.2em', animationDelay: '1.2s' }}>🧪</span>
      <div className="glass-card pop-in">
        <h2 className="ptable-title">Ionic Name → Formula Activity</h2>
        <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Name: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.name}</span></div>
        <form onSubmit={handleSubmit}>
          <input
            className="glow-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the formula here"
            ref={inputRef}
            style={{ width: '100%', maxWidth: 420 }}
          />
          <div className="subscript-btn-row">
            {['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'].map((sub, idx) => (
              <button
                key={sub}
                type="button"
                className="subscript-btn"
                onClick={() => insertSubscript(sub)}
                tabIndex={-1}
              >{sub}</button>
            ))}
          </div>
          <button className="ptable-btn" type="submit" style={{ width: '100%', marginBottom: 6 }}>Submit</button>
        </form>
        {feedback && (
          <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'} style={{ whiteSpace: 'pre-line', fontSize: '1.08em', borderRadius: 16, margin: '16px 0', padding: '18px 16px', textAlign: 'left', maxWidth: 420, width: '100%', boxSizing: 'border-box', background: feedback.startsWith('✅') ? undefined : 'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)', color: feedback.startsWith('✅') ? undefined : '#fff', boxShadow: feedback.startsWith('✅') ? undefined : '0 2px 16px #a259ec55' }}>
            {feedback}
          </div>
        )}
        <button className="ptable-btn" onClick={handleNext}>Try Another</button>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
